import { Injectable } from '@angular/core';
import { Heroes } from './hero';
import { HEROES } from './mock-heroes';
import { Observable , of} from 'rxjs';
import { MessagesService } from './messages.service';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  
  constructor(
    private messageService : MessagesService,
    private httpClient : HttpClient,
  ) {}

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes() : Observable<Heroes[]>{
    return this.httpClient.get<Heroes[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Heroes[]>('getHeroes', []))
    );
  }

  getHero(id:number): Observable<Heroes>{
    return this.httpClient.get<Heroes>(`${this.heroesUrl}/${id}`).pipe(
      tap(_ => this.log('fetched heroe')),
      catchError(this.handleError<Heroes>(`getHero id = ${id}`))
    );
  }

  updateHero(hero : Heroes) : Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.heroesUrl, hero,httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Heroes) : Observable<Heroes>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<Heroes>(this.heroesUrl,hero,httpOptions).pipe(
      tap((newHero: Heroes) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Heroes>('addHero'))
    );
  }

  deleteHero (hero: Heroes | number): Observable<Heroes> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
  
    return this.httpClient.delete<Heroes>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Heroes>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Heroes[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.httpClient.get<Heroes[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Heroes[]>('searchHeroes', []))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
