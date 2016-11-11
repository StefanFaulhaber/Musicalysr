import { Pipe, PipeTransform, Injectable } from '@angular/core';

import { Artist } from './models/artist';

/**
 *  <input [(model)]="query" type="text" />
 *  <ul>
 * 		<li *ngFor="let hero of heroes | search:query" >{{hero.name}}</li>
 *  </ul>
 */

@Pipe({
	name: 'search',
	pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {
	transform(artists:Artist[], query:string):Artist[] {

		let result: Artist[] = new Array();
		let lName: string = '';					// lowercase name
		let lQuery: string = '';				// lowercase query

		if (query == '' || query == null)
			return artists;
		else {
			for (let artist of artists) {
				lName = artist.name.toLowerCase();
				lQuery = query.toLowerCase();
				
				if (lName.indexOf(lQuery) !== -1)
					result.push(artist);
			}
		}

		return result;
	}
}