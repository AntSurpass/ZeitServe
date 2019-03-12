import { Component, OnInit } from '@angular/core';
import { AppService, Count } from '../app.service';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit {

  // 天数初始化
  doption;
  // 月份初始化
  moption;

  // 月份数据
  mmerge;
  // 天数数据
  dmerge;

  data: Count;
  isloading = true;

  constructor(private appSrv: AppService) {
   }

  ngOnInit() {
    this.setData();
    
    this.appSrv.getCount().subscribe( res => {
      this.data = res.data;
      this.setOption(res.data);
    });
  }

setOption(res) {
    this.mmerge = {
      series:  [
        {
          name: '主页',
          type: 'bar',
          data: this.fillmonths(res.home_monthly_views)
        },
        {
          name: '文档',
          type: 'bar',
          data: this.fillmonths(res.doc_monthly_views)
        },
        {
          name: 'UIFLOW',
          type: 'bar',
          data: this.fillmonths(res.uiflow_monthly_users)
        }
      ]
    };
    this.dmerge = {
      series: [
        {
          name: '主页数量',
          type: 'bar',
          data: this.filldays(res.home_daily_views)
        },
        {
          name: '文档数量',
          type: 'bar',
          data: this.filldays(res.doc_daily_views)
        },
        {
          name: 'UIFLOW数量',
          type: 'bar',
          data: this.filldays(res.uiflow_daily_users)
        },
      ]
    };
}
 // 初始化
  setData() {
    this.moption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['主页', '文档', 'UIFLOW']
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '每月访问总数',
          max: 'dataMax',
          interval: 500,
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          show: false
        }
      ],
      series: [
        {
          name: '主页',
          type: 'bar',
        },
        {
          name: '文档',
          type: 'bar',
        },
        {
          name: 'UIFLOW',
          type: 'bar',
        }
      ]
    };
    this.doption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['主页每天访问数', '文档每天访问数', 'UIFLOW每天访问数']
      },
      xAxis: [
        {
          type: 'category',
          data: this.getdays(),
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '每天访问总数',
          max: 'dataMax',
          interval: 100,
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          show: false
        }
      ],
      series: [
        {
          name: '主页每天访问数',
          type: 'bar',
        },
        {
          name: '文档每天访问数',
          type: 'bar',
        },
        {
          name: 'UIFLOW每天访问数',
          type: 'bar',
        }
      ]
    };
  }
  // 天数横坐标
  getdays() {
    const days = [];
    for (let index = 1; index <= 31; index++) {
      days.push(`${index}号`);
    }
    return  days;
  }

   //  月份不够填充
   fillmonths(month) {
    const marr = [];
    const mlength = new Date().getMonth();
    month.map( e => {
      marr.push(e.count);
    });
    if (marr.length < mlength + 1) {
    const arr = new Array(mlength + 1 - marr.length).fill(0);
    return arr.concat(marr);
    }
    return marr;
  }

 //  天数不够填充
  filldays(days) {
    const darr = [];
    const tlength = new Date().getDate();
    days.map( e => {
      darr.push(e.count);
    });
    if (darr.length < tlength) {
    const arr = new Array(tlength - days.length).fill(0);
    return arr.concat(darr);
    }
    return darr;
  }
}
