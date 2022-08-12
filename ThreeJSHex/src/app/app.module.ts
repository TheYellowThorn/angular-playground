import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HexMapComponent } from './pages/hex-map/hex-map.component';
import { HexGlobeComponent } from './pages/hex-globe/hex-globe.component';
import { SpriteAnimationComponent } from './pages/sprite-animation/sprite-animation.component';
import { AStarPathfindingComponent } from './pages/a-star-pathfinding/a-star-pathfinding.component';

@NgModule({
  declarations: [
    AppComponent,
    HexMapComponent,
    HexGlobeComponent,
    SpriteAnimationComponent,
    AStarPathfindingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
