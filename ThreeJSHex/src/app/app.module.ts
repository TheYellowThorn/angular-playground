import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HexMapComponent } from './pages/hex-map/hex-map.component';
import { HexGlobeComponent } from './pages/hex-globe/hex-globe.component';
import { SpriteAnimationComponent } from './pages/sprite-animation/sprite-animation.component';
import { AStarPathfindingComponent } from './pages/a-star-pathfinding/a-star-pathfinding.component';
import { DelaunayComponent } from './pages/delaunay/delaunay.component';
import { HexBattleComponent } from './pages/hex-battle/hex-battle.component';
import { MusicBattleComponent } from './pages/music-battle/music-battle.component';

@NgModule({
  declarations: [
    AppComponent,
    HexMapComponent,
    HexGlobeComponent,
    SpriteAnimationComponent,
    AStarPathfindingComponent,
    DelaunayComponent,
    HexBattleComponent,
    MusicBattleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
