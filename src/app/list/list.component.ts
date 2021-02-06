import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { MovieModel} from '../models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  movies:MovieModel[];
  results:MovieModel[];
  isLoading:boolean = true;

  constructor(private ms:MovieService,
              private router:Router) {  }

  // detail(movie:MovieModel):string {
  //   return "detail/"+movie.id;
  // }

  // s'execute avant la vue et après le constructor()
  //  voir lifeCycle des composants et méthodes qui s'execute
  // à des moments précis 
  ngOnInit(): void {
    
    this.isLoading = true;
    // console.log('isloading avant=' , this.isLoading);

     this.ms.getMoviesFromApi();
    //  on s'abonne au subject de MovieService
    // on aura les changt en TR
     this.ms.movies$.subscribe(
        (data:MovieModel[]) => {
                    this.movies = data ;
                    this.isLoading = false;
                    // console.log('isloading apres=' , this.isLoading);
                    // console.log('data',data);
      } );

      // on s'abonne à une autre source search
      this.ms.search$.subscribe( data => { 
                    this.results = data;
      } );

  }

  printImagesrc(movie:MovieModel):string {
    return "https://image.tmdb.org/t/p/w500"+movie.image;
  }

  loadNextMovies() {
    this.isLoading = true;
    this.ms.getNextMoviesFromApi();
    
  }

  getListOpacity() {
    return this.isLoading?0.1:1;
  }

  searchMovies(searchText:string) {
    console.log(searchText);
    if (searchText.trim().length == 0) {
      this.ms.search$.next([0]) ;
    } else {
      this.ms.searchMoviesFromApi(searchText);
    }
  }

  goToDetailPage(movieId) {
    this.router.navigate(['detail/', movieId, 'search']);
  }
}
