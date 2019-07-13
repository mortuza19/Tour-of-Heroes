import { Component, OnInit, Input } from '@angular/core';
import { Heroes } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service'
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  selectedHero : Heroes;
  id ;
  constructor(
    private route : ActivatedRoute,
    private location : Location,
    private heroService : HeroService
  ) {}

  getHero() {
    this.route.paramMap.subscribe(param => this.id = param.get('heroId'))
    this.heroService.getHero(this.id)
      .subscribe(hero => this.selectedHero = hero);
  }

  goBack(){
    this.location.back()
  }

  save(): void {
    this.heroService.updateHero(this.selectedHero)
      .subscribe(() => this.goBack());
  }

  ngOnInit() {
    this.getHero()
  }

}
