import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HexGlobeComponent } from './pages/hex-globe/hex-globe.component';
import { HexMapComponent } from './pages/hex-map/hex-map.component';
import { HexBattleComponent } from './pages/hex-battle/hex-battle.component';
import { SpriteAnimationComponent } from './pages/sprite-animation/sprite-animation.component';
import { AStarPathfindingComponent } from './pages/a-star-pathfinding/a-star-pathfinding.component';
import { DelaunayComponent } from './pages/delaunay/delaunay.component';
import { MusicBattleComponent } from './pages/music-battle/music-battle.component';
import { IcosahedronNetComponent } from './pages/icosahedron-net/icosahedron-net.component';

const routes: Routes = [
  { path: 'hex-map', component: HexMapComponent },
  { path: 'hex-globe', component: HexGlobeComponent },
  { path: 'hex-battle', component: HexBattleComponent },
  { path: 'sprite-animation', component: SpriteAnimationComponent },
  { path: 'pathfinding', component: AStarPathfindingComponent },
  { path: 'delaunay', component: DelaunayComponent },
  { path: 'music-battle', component: MusicBattleComponent },
  { path: 'icosahedron-net', component: IcosahedronNetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
