import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-stem',
  templateUrl: './stem.component.html',
  styleUrls: ['./stem.component.scss']
})
export class StemComponent implements OnInit {
   caseList: string[];
  constructor(private storeSev: StoreService) { }

  ngOnInit() {
    // this.getIMG();
  }
  getIMG(){
    this.storeSev.getImages('case').subscribe( res => {
      res.data =  res.data.map((item) => {
          item = `/images/case/${item}`;
          return item;
      });
      this.caseList  = res.data;
      console.log(this.caseList);
    });
  }

}
