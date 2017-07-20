import { Component, OnInit } from '@angular/core';
import { UserLookupService } from './../github-service/user-lookup.service';
import { UserData } from './../user-data.model';
import { Repo } from './../repo.model';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  providers: [UserLookupService]
})
export class UserSearchComponent implements OnInit {

  searchedUser: UserData = null;

  constructor(
    private userSearch: UserLookupService
  ) { }

  ngOnInit() {
  }

  lookupUser(username: string): void {
    this.userSearch.getUserDetails(username).subscribe(data => {
      const user = data.json();

      this.searchedUser = new UserData(
        user.login,
        user.name,
        user.html_url,
        user.avatar_url,
        user.bio,
        user.location,
        user.created_at,
        user.updated_at,
        user.public_repos,
        [],
        user.followers,
        user.following,
        []
      );
      console.log(user);

      this.userSearch.call(user.repos_url).subscribe(data => {
        const repositoriesData = data.json();
        repositoriesData.forEach(repo => {
          this.searchedUser.repos.push(new Repo(repo.name,
                              repo.html_url,
                              repo.language,
                              repo.stargazers_count,
                              repo.homepage
                            ));
        });
      });

      const url = user.starred_url.split('{')[0];
      this.userSearch.call(url).subscribe(data => {
        const starredReposData = data.json();
        starredReposData.forEach(repo => {
          this.searchedUser.starredRepos.push(new Repo( repo.name,
                                                        repo.html_url,
                                                        repo.language,
                                                        repo.stargazers_count,
                                                        repo.homepage));
        });
      });
    });
  }
}
