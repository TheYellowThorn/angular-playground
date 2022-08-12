import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HexGlobeComponent } from './pages/hex-globe/hex-globe.component';
import { HexMapComponent } from './pages/hex-map/hex-map.component';
import { SpriteAnimationComponent } from './pages/sprite-animation/sprite-animation.component';
import { AStarPathfindingComponent } from './pages/a-star-pathfinding/a-star-pathfinding.component';

const routes: Routes = [
  {path: 'hex-map', component: HexMapComponent },
  {path: 'hex-globe', component: HexGlobeComponent},
  {path: 'sprite-animation', component: SpriteAnimationComponent},
  {path: 'pathfinding', component: AStarPathfindingComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
