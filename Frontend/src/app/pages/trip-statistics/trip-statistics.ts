import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '@app/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Global } from '@app/global';

// PrimeNG 组件
import { CalendarModule } from 'primeng/calendar';  //提供一个日期选择器组件 (Date Picker) 与 <p-calendar>绑定使用
import { RadioButtonModule } from 'primeng/radiobutton'; //提供单选按钮组件 (Radio Button) 与 <p-radioButton>绑定使用
import { ButtonModule } from 'primeng/button'; //提供按钮的图标icon，样式 与 <p-button>绑定使用
import { CardModule } from 'primeng/card';   //用于展示标题，内容

/*
 Chart.js 1. Chart用于创建和操作图表对象 (Diagrammobjekte erstellen und bearbeiten)
 2.ChartConfiguration描述图表的配置对象类型 数据、选项(Beschreibt den Konfigurationstyp eines Diagramms)daten, optionen
 3.ChartType限定图表类型的联合类型，例如 'bar', 'line', 'pie' 'radar'等 (Ein Union-Typ zur Einschränkung von Diagrammtypen)
 */
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { registerables } from 'chart.js'; //registerables是一个包含 Chart.js 所有必要组件的数组 Diagrammtypen,Legende,Achsen

// 注册Chart.js组件 (Chart.js-Komponenten registrieren) 因为Version3 von Chart.js 默认不会自动注册任何组件 (Chart.js-Komponenten werden nicht automatisch registriert)
Chart.register(...registerables);

//klar definierten Key-Value-Paaren 明确定义好的键值对
interface TripStatisticsData {
  time: number;
  income: number;
  distance: number;
  duration: number;
  average_rate: number;
}

interface ViewType {
  label: string;
  value: string;
}

interface ChartViewType {
  label: string;
  value: string;
}

@Component({
  selector: 'app-trip-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    CalendarModule,
    RadioButtonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './trip-statistics.html',
  styleUrls: ['./trip-statistics.css']
})
export class TripStatisticsComponent implements OnInit, AfterViewInit {
  /*
  1.@ViewChild 是属性装饰器 Eigenschafts/Property-Dekorator
  2.static: false: 必须在组件的 视图初始化（ngAfterViewInit）之后 才能访问该元素Chart
  3. 红色incomeChart 定义一个名为 incomeChart的变量名，该变量的类型是 Angular 的 ElementRef，里面包装的是一个 <canvas> 元素
  incomeChart是 Angular中的 ElementRef类型，incomeChart.nativeElement 是一个 <canvas> 元素 (!非空断言运算,weder null noch undefined!)
   */
  @ViewChild('incomeChart', { static: false }) incomeChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('distanceChart', { static: false }) distanceChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationChart', { static: false }) durationChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ratingChart', { static: false }) ratingChart!: ElementRef<HTMLCanvasElement>;

  // 筛选条件 Bedingungen filtern
  selectedType: string = 'month';
  selectedTime: Date | null = null;  //Date是JavaScript中内置的全局对象类型，用于处理日期和时间 (eingebauter globaler Typ in JavaScript)
  selectedView: string = 'line';

  // 数据 Data
  statisticsData: TripStatisticsData[] = [];
  loading: boolean = false;

  // 当前用户名 aktueller Benutzer Name
  username: string = '';

  // 选项配置 Optionseinstellungen
  typeOptions: ViewType[] = [           //typeOptions是一个ViewType[]类型的数组，包含两个元素，每个元素是一个对象
    { label: 'monatlich', value: 'month' },   //把 typeOptions中的每一项渲染为一个 <p-radioButton>
    { label: 'täglich', value: 'day' }
  ];

  viewOptions: ChartViewType[] = [
    { label: 'Liniendiagramme', value: 'line' },
    { label: 'Balkendiagramme', value: 'bar' }
  ];

  // Chart.js实例
  private incomeChartInstance: Chart | null = null;     //Chart是 Chart.js提供的类，不是 JS 内置类型
  private distanceChartInstance: Chart | null = null;
  private durationChartInstance: Chart | null = null;
  private ratingChartInstance: Chart | null = null;

  constructor(
    private route: ActivatedRoute,
    //ChangeDetectorRef是Angular框架提供的一个服务类（类型） 手动检测到数据变化并更新视图 (manuelle Änderungen der Daten erkennen)
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username']; //username是一个 动态路径参数 dynamischer Routenparameter
      this.initializeDefaultTime();
    });
  }

  ngAfterViewInit() {
    /*
     在视图初始化完成后加载数据 ngAfterViewInit() 在视图渲染完成后执行
     Daten werden nach der Initialisierung der Ansicht geladen. ngAfterViewInit()erst nach dem vollständigen Aufbau der Ansicht.
     */
    this.loadData();
  }

  initializeDefaultTime() {
    const now = new Date();  //Holt das aktuelle Datum und Uhrzeit 获取当前时间 z.B. 2025-07-14T14:30:15.000Z
    if (this.selectedType === 'month') {
      //月视图 默认时间 2025.01.01
      this.selectedTime = new Date(now.getFullYear(), 0, 1);  //getFullYear()返回当前日期的完整年份
    } else {
      //日视图 默认时间 2025.07.01
      this.selectedTime = new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  onTypeChange() {
    this.initializeDefaultTime();
  }

  loadData(){
    if (!this.selectedTime) return;   //确保时间已初始化

    this.loading = true;

    // 构建时间字符串 timeStr:  Zeitstring timeStr aufbauen
    let timeStr = '';
    if (this.selectedTime) {
      if (this.selectedType === 'month') {
          timeStr = this.selectedTime.getFullYear().toString(); //timeStr = "2025"
      } else if (this.selectedType === 'day'){
          const year = this.selectedTime.getFullYear();
          /*
           1. String(...)方法 将括号中的任意值转换成字符串类型  Konvertiert jeden beliebigen Wert in einen string
           2. padStart(2, '0')方法 用'0'填充原字符串的左侧，直到 新的字符串 长度达到2。如果原字符串已经 ≥ maxLength，则不会做任何操作
           */
          const month = String(this.selectedTime.getMonth() + 1).padStart(2, '0'); //month = "07"
          timeStr = `${year}-${month}`;
      }
    }
    const url = `${Global.driverStatsUrl}/${this.username}?type=${this.selectedType}&time=${timeStr}`;
    //通过 HttpClient发起了一个 GET请求
    this.http.get<TripStatisticsData[]>(url).subscribe({
      next: (data) => {
        this.statisticsData = data;
        this.loading = false;
        this.cdr.detectChanges(); //强制手动更新视图 Erzwingt eine manuelle View-Aktualisierung
        setTimeout(() => {
          this.updateChart();
        }, 100);     //100毫秒后 执行更新图表
      },
      error: (error) => {
        console.error('Failed to fetch data:', error);
        this.loading = false;
      }
    });
 }

  updateChart() {
    /*
     确保HTML canvas元素通过 @ViewChild 正确获取到
     Stelle sicher, dass das Canvas-Element vorhanden ist. ob @ViewChild korrekt referenziert ist
     */
    if (!this.incomeChart || !this.incomeChart.nativeElement ||
      !this.distanceChart || !this.distanceChart.nativeElement ||
      !this.durationChart || !this.durationChart.nativeElement ||
      !this.ratingChart || !this.ratingChart.nativeElement) {
      console.log('Canvas element not ready');
      return;
    }

    // 销毁旧的图表 alte Diagramme löschen  因为Chart.js 的图表不能重复绘制在同一个 <canvas>上，所以需要先销毁旧的图表！ 否则会出现图表重叠
    if (this.incomeChartInstance) {
      this.incomeChartInstance.destroy();
    }
    if (this.distanceChartInstance) {
      this.distanceChartInstance.destroy();
    }
    if (this.durationChartInstance) {
      this.durationChartInstance.destroy();
    }
    if (this.ratingChartInstance) {
      this.ratingChartInstance.destroy();
    }

    //Labels für X-Achse erzeugen 生成X轴标签  Chart.js 要求  labels是字符串数组
    const labels = this.statisticsData.map(item =>
      this.selectedType === 'month' ? `${item.time}` : `${item.time}`
    );


    // 详细配置一个 Chart.js 图表的所有参数  Einkommen-Diagramm Konfiguration
    // @ts-ignore
    const incomeConfig: ChartConfiguration = {    //声明一个名为 incomeConfig 的图表配置对象，是Chart.js的 "ChartConfiguration类型"
      type: this.selectedView as ChartType,  //图表类型(bar柱状图，line折线图) 并断言为合法的 ChartType
      data: {
        labels: labels,                      //X轴标签("1","2","3"...) Labels für X-Achse
        datasets: [{                         //图表中绘制的数据
          label: 'Einkommen(€)',             //数据集的名称，用于图例显示  Name des Datensatzes, der in der Legende angezeigt wird.
          data: this.statisticsData.map(item => item.income),  //Y轴数据，使用 statisticsData 数组中每项的 income 值
          borderColor: '#2196F3',             //边框颜色 蓝色
          backgroundColor: '#2196F3',         //背景颜色 蓝色
          tension: 0.4                        //线条的弯曲度，0表示直线，1表示最弯曲 Der Krümmungsgrad der Linie
        }]
      },
      options: {                             //图表的展示选项（控制响应式、比例、图例、标题、坐标轴等
        responsive: true,                    //图表自动适应 屏幕的大小/缩放  passt sich Containergröße an
        maintainAspectRatio: false,          //图表的宽高比例不固定，自由适应容器的宽度和高度 Das Seitenverhältnis wird nicht beibehalten.
        plugins: {                           //插件配置
          title: {
            display: false                   //隐藏图表的主标题  因为已经在html中设置了标题
          },
          legend: {
            position: 'top'                  //图例位于图表顶部  默认display: true!
          }
        },
        scales: {                            //坐标轴设置  Achsen-Konfiguration
          x: {
            title: {
              display: true,                 //显示X轴的标题文本
              text: this.selectedType === 'month' ? 'month' : 'date' //标题内容根据 selectedType 动态变化，如果是 'month' 则显示“月份”，否则为“日期”
            }
          },
          y: {
            type: 'linear',                  //Y轴数据类型为线性
            display: true,                   //！！显示整个Y坐标轴（含刻度线，标签等）
            position: 'left',                //显示在左侧
            title: {
              display: true,                 //显示Y轴的标题文本
              text: 'Einkommen(€)'           //文本内容为“收入”
            }
          }
        }
      }
    };

    // 距离图表配置  Distanz-Diagramm Konfiguration
    // @ts-ignore
    const distanceConfig: ChartConfiguration = {
      type: this.selectedView as ChartType,  //图表类型 bar柱状图，line折线图 由组件中的 this.selectedView 决定，并断言为合法的 ChartType
      data: {
        labels: labels,
        datasets: [{
          label: 'Distanz(km)',             //数据集的名称，用于图例显示 绿色！
          data: this.statisticsData.map(item => item.distance), //Y轴数据，使用 statisticsData数组中每项的 distance值
          borderColor: '#4CAF50',           //边框颜色 绿色
          backgroundColor: '#4CAF50',       //背景颜色 绿色
          tension: 0.4                      //线条的弯曲度，0表示直线，1表示最弯曲
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false                //隐藏图表的主标题
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: this.selectedType === 'month' ? 'month' : 'date'
            }
          },
          y: {
            type: 'linear',
            display: true,           //！！显示整个Y坐标轴（含刻度线，标签等）
            position: 'left',
            title: {
              display: true,
              text: 'Distanz(km)'
            }
          }
        }
      }
    };

    // 行驶时长图表配置  Fahrtzeit-Diagramm Konfiguration
    // @ts-ignore
    const durationConfig: ChartConfiguration = {
      type: this.selectedView as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Zeitdauer(min)',
          data: this.statisticsData.map(item => item.duration),
          borderColor: '#FF9800',
          backgroundColor: '#FF9800',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: this.selectedType === 'month' ? 'month' : 'date'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Zeitdauer(min)'
            }
          }
        }
      }
    };

    // 评分图表配置  Bewertung-Diagramm Konfiguration
    // @ts-ignore
    const ratingConfig: ChartConfiguration = {
      type: this.selectedView as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'durchschnittliche Bewertung',
          data: this.statisticsData.map(item => item.average_rate),
          borderColor: '#E91E63',
          backgroundColor: '#E91E63',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: this.selectedType === 'month' ? 'month' : 'date'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'durchschnittliche Bewertung'
            },
            min: 0,
            max: 5
          }
        }
      }
    };

    //在 canvas 元素上创建 Chart.js 图表实例，并捕获创建过程中可能出现的错误
    try {
      //new Chart(canvasElement, chartConfiguration) 使用之前定义的 incomeConfig配置，在 incomeChart的 canvas上 创建一个图表对象
      this.incomeChartInstance = new Chart(this.incomeChart.nativeElement, incomeConfig);
      this.distanceChartInstance = new Chart(this.distanceChart.nativeElement, distanceConfig);
      this.durationChartInstance = new Chart(this.durationChart.nativeElement, durationConfig);
      this.ratingChartInstance = new Chart(this.ratingChart.nativeElement, ratingConfig);
      console.log('Chart created successfully');
    } catch (error) {
      console.error('Chart creation error:', error);
    }
  }

  onSearch() {
    this.loadData();
  }

  onReset() {
    this.selectedType = 'month';
    this.selectedView = 'line';
    this.initializeDefaultTime();
    this.loadData();
  }
}


