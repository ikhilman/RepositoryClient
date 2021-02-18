import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Repository } from 'src/app/models/respository';
import { BookmarkAction } from 'src/app/models/enums';
import { IkeyValue } from 'src/app/models/iKeyValue';
import { RepositoriesService } from '../../services/repositories.service'
import { AuthService } from '../../services/auth.service'
import { filter, map } from 'rxjs/operators'
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('searchInput') searchInput: ElementRef;
  reposSearchResult: Repository[] = [];
  searchInputSubscription: Subscription;
  token: string;
  bookmarksList: IkeyValue<number> = {};

  constructor(
    private repoService: RepositoriesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Fake login on init
    this.authService.authUser('ikhilman@gmail.com', '123456')
      .subscribe(response => {
        this.token = response;
        // Get stored bookmarks
        this.getBookmarks();
      });
  }

  ngAfterViewInit(): void {
    // subscribe to enter key event
    this.searchInputSubscription = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(filter((e: any) => e.key === 'Enter' && e.target.value)) 
      .subscribe(x => {
        // get repositories from server
        this.getRepos(this.searchInput.nativeElement.value);
      })
  }

  async getRepos(searchValue: any) {
    try {
      this.reposSearchResult = await this.repoService
        .getRepositories(searchValue)
        .pipe(map(response => response?.items || []))
        .toPromise();
    } catch (error) { console.error(error); }
  }

  async bookmarkRepository(id: number) {
    try {
      // get bookmark action add/remove
      const bookMarkAction: BookmarkAction = this.bookmarksList[id] ? BookmarkAction.Remove : BookmarkAction.Add;
      await this.repoService.bookmarkRepository(id, this.token, bookMarkAction).toPromise();
      // set seved bookmarks list 
      bookMarkAction === BookmarkAction.Add ? this.bookmarksList[id] = id : this.bookmarksList[id] = null;
    } catch (error) { console.error(error); }
  }

  async getBookmarks() {
    await this.repoService.getBookmarks(this.token)
      .pipe(map(list => {
        list.forEach(item => {
          this.bookmarksList[item] = item;
        })
      })).toPromise()
  }

  ngOnDestroy(): void {
    this.searchInputSubscription.unsubscribe();
  }
}
