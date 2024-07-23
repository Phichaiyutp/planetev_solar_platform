import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../utils/helpers/custom_fonts';
import { images64 } from './Base64Image';
import { Daily, Device, Item, Station } from './typeReport';

pdfMake.vfs = pdfFonts;

export const generatePdf = async (items: Item) => {
  try {
    const promises = items.stations
      .filter((station: Station) => station.details.chartEndpoint)
      .map(async (station: Station) => {
        const chartData = await fetchChartData(station.details.chartEndpoint);
        if (chartData) {
          return {
            image: `data:image/png;base64,${chartData}`,
            width: 580,
            height: 220,
            margin: [5, 10, 10, 10],
          };
        } else {
          return null;
        }
      });

    const graph_images = await Promise.all(promises);
    const filtered_graph_images = graph_images.filter(image => image !== null);

    const chunkSize = 8;
    let chunks: any[] = [];
    let contentBranch: any[] = [];
    let NewPage: any[] = [];

    pdfMake.fonts = {
      THSarabunNew: {
        normal: "THSarabunNew.ttf",
        bold: "THSarabunNew Bold.ttf",
        italics: "THSarabunNew Italic.ttf",
        bolditalics: "THSarabunNew BoldItalic.ttf",
      },
    };

    let homepage = [
      {
        columns: [
          {
            width: "*",
            text: "",
          },
          {
            image: `${images64.logo_planetcomm}`,
            width: 140,
            height: 40,
            alignment: "right",
            margin: [0, 15, 20, 20],
          },
        ],
      },
      {
        text: "รายงานสรุปโครงการติดตั้งระบบผลติ ไฟฟ้าพลังงานแสงอาทิตย์บนหลังคา\n ( Solar Rooftop System ) และจําหน่ายไฟฟ้า",
        fontSize: 20,
        style: "header",
      },
      {
        text: `${items.billPeriod}\n(ระหว่างวันที่ ${(items.summaryDateForm)} - ${(items.summaryDateTo)})`,
        fontSize: 20,
        style: "header",
        margin: [0, 15, 0, 0],
      },
      {
        text: "บริษัท ซี.เจ. เอ็กซ์เพรส กรุ๊ป จำกัด",
        fontSize: 20,
        style: "header",
        margin: [0, 350, 0, 0],
      },
      {
        text: "โดย",
        fontSize: 20,
        style: "header",
        margin: [0, 50, 0, 0],
      },
      {
        text: "บริษัทแพลนเน็ตคอมมิวนิเคชั่น เอเชีย จํากัด (มหาชน)",
        fontSize: 20,
        style: "header",
        margin: [0, 50, 0, 0],
      },
    ]

    // Table Branch
    if (items.stations) {
      // for (let i = 0; i < items.stations.length; i += chunkSize) {
      //   chunks.push(items.stations.slice(i, i + chunkSize));
      // }
      chunks = Array.from({ length: Math.ceil(items.stations.length / chunkSize) }, (_, index) =>
        items.stations.slice(index * chunkSize, (index + 1) * chunkSize)
      );
    }

    chunks.forEach((chunk, index) => {
      contentBranch.push(
        {
          columns: [
            {
              width: "*",
              text: "",
            },
            {
              image: `${images64.logo_planetcomm}`,
              width: 140,
              height: 40,
              alignment: "right",
              margin: [0, 15, 20, 20],
            },
          ],
        },
        {
          text: `รายงานสรุปค่าไฟ ${items.billPeriod} \n(ระหว่างวันที่ ${(items.summaryDateForm)} - ${(items.summaryDateTo)})`,
          fontSize: 20,
          style: "header",
          margin: [0, 10, 0, 10],
        },
        {
          width: "100%",
          table: {
            widths: ["33.33%", "33.33%", "33.33%"],
            body: [
              [
                {
                  text: `สาขา`,
                  fontSize: 20,
                  bold: true,
                  alignment: "center",
                },
                {
                  text: `PV Yield (kWh)`,
                  fontSize: 20,
                  bold: true,
                  alignment: "center",
                },
                {
                  text: `ค่าไฟ (บาท)`,
                  fontSize: 20,
                  bold: true,
                  alignment: "center",
                },
              ],
              ...chunk.map((item: any) => [
                {
                  text: `${item.name}`,
                  fontSize: 20,
                  bold: true,
                  alignment: "center",
                },
                {
                  text: `${formatNumberWithCommas(item.yield)}`,
                  fontSize: 20,
                  bold: true,
                  alignment: "center",
                  margin: [0, 10],
                },
                {
                  text: `${formatNumberWithCommas(item.amount)}`,
                  fontSize: 20,
                  bold: true,
                  alignment: "center",
                  margin: [0, 10],
                },
              ]),
            ],
          },
          margin: [40, 10, 40, 0],
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: any, node: any) {
              return 0.5;
            },
            hLineColor: function (i: any, node: any) {
              return "#000000";
            },
            vLineColor: function (i: any, node: any) {
              return "#000000";
            },
          },
        },
        {
          absolutePosition: { x: 0, y: 680 },
          columns: [
            {
              stack: [
                {
                  text: "วิศวกรเทคนิค",
                  fontSize: 20,
                  style: "header",
                },
                {
                  text: `${items.peopleInvolved?.eng}`,
                  fontSize: 18,
                  alignment: "center",
                  // background: "#ffd100",
                  margin: [0, 10, 0, 0],
                },
                {
                  text: "_____/_____/_____",
                  margin: [0, 10],
                  alignment: "center",
                  fontSize: 20,
                },
              ],
              margin: [10, 0, 10, 0],
            },
            {
              stack: [
                {
                  text: "ผู้จัดการโครงการ",
                  fontSize: 20,
                  style: "header",
                },
                {
                  text: `${items.peopleInvolved?.pm}`,
                  fontSize: 18,
                  alignment: "center",
                  // background: "#ffd100",
                  margin: [0, 10, 0, 0],
                },
                {
                  text: "_____/_____/_____",
                  margin: [0, 10],
                  alignment: "center",
                  fontSize: 20,
                },
              ],
            },
            {
              stack: [
                {
                  text: "ฝ่ายตรวจสอบ",
                  fontSize: 20,
                  style: "header",
                },
                {
                  text: `${items.peopleInvolved?.inspector}`,
                  fontSize: 18,
                  alignment: "center",
                  // background: "#ffd100",
                  margin: [0, 10, 0, 0],
                },
                {
                  text: "_____/_____/_____",
                  margin: [0, 10],
                  alignment: "center",
                  fontSize: 20,
                },
              ],
            },
          ],
        }
      );

      if (index < chunks.length - 1) {
        contentBranch.push({ text: "", pageBreak: "after" });
      }
    });


    items.stations.forEach((station: Station, index: number) => {
      const onPeakAmount = station.details.onPeakAmount ?? 0;
      const offPeakAmount = station.details.offPeakAmount ?? 0;
      const totalAmount = onPeakAmount + offPeakAmount;

      const pageReport = [{
        columns: [
          {
            image: `${images64.logo_planetcomm}`,
            width: 110,
            height: 35,
            margin: [5, 10, 10, 10],
          },
          {
            width: "*",
            text: "",
          },
          {
            table: {
              body: [
                [
                  {
                    text: "Monthly Report",
                    fontSize: 14,
                    bold: true,
                    alignment: "right",
                    fillColor: "#fde699",
                    margin: [40, 8, 40, 8],
                    border: [false, false, false, false],
                  },
                ],
              ],
            },
            layout: "noBorders",
            margin: [0, 5, 2, 0],
            width: "auto",
          },
        ],
      }];

      // headerDetailpj
      let headerDetailpj = {
        header1: [
          {
            text: `รายละเอียดโครงการ (Project Detail)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#a9d08f",
            border: [true, true, true, true],
            colSpan: 2,
          },
          {},
          {
            text: `วันที่ (Date)`,
            fontSize: 8,
            bold: true,
            border: [true, true, false, true],
            colSpan: 2,
          },
          {},
          {
            text: `${formatDate(station.details.date)}`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, false],
          },
        ],
        header2: [
          {
            text: `ชื่อโครงการ (Name)`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
          },
          {
            text: `${station.details.project}`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
          },
          {
            text: `ผู้เขียนสรุป (Prepared by)`,
            fontSize: 8,
            bold: true,
            border: [true, true, false, true],
            colSpan: 2,
          },
          {},
          {
            text: ``,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
          },
        ],
        header3: [
          {
            text: `สถานที่ติดตั้ง (Location)`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
          },
          {
            text: `${station.details.location}`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
          },
          {
            text: `วันที่สรุป (Summary date)`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
            alignment: "center",
            rowSpan: 2,
            margin: [0, 7],
          },
          {
            text: `start`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            border: [true, true, true, true],
          },
          {
            text: `${formatDate(station.details.summaryDateForm)}`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
          },
        ],
        header4: [
          {
            text: "ขนาดความจุ (Capacity)",
            fontSize: 8,
            bold: true,
            border: [true, false, true, true],
          },
          {
            text: `${station.details.capacity.toFixed(2)} kWp`,
            fontSize: 8,
            bold: true,
            border: [true, false, true, true],
          },
          {},
          {
            text: `end`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            border: [true, true, true, true],
          },
          {
            text: `${formatDate(station.details.summaryDateTo)}`,
            fontSize: 8,
            bold: true,
            border: [true, true, true, true],
          },
        ],
      };

      let TableProjectDetail = [
        {
          table: {
            widths: ["21%", "41%", "12%", "5%", "21%"],
            body: [
              headerDetailpj.header1,
              headerDetailpj.header2,
              headerDetailpj.header3,
              headerDetailpj.header4,
            ],
          },
          margin: [2, 2, 2, 0],
          layout: {
            paddingTop: function (i: number, node: any) {
              return 1;
            },
            paddingBottom: function (i: number, node: any) {
              return 1;
            },
            hLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            hLineColor: function (i: number, node: any) {
              return "#000000";
            },
            vLineColor: function (i: number, node: any) {
              return "#000000";
            },
          },
        },
      ]

      // headerTypeTOU
      let headerTypeTOU = {
        type: [
          {
            text: `ประเภท \n(Type)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `จํานวนหน่วยที่ใช้\n(Off Peak) kWh`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `จํานวนหน่วยที่ใช้\n(On Peak) kWh`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `รวมจำนวนหน่วยที่ใช้\n(Total) kWh`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `ส่วนลด\n(Discount)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `อัตราไฟฟ้าผันแปร\n(ft)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `บิลประจำเดือน\n(Bill Perload)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `รวมเงินค่าไฟฟ้าที่ต้องชำระ\n(Amount)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
        ],
        value: [
          {
            text: `${station.details.voltRate}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.offPeak}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.onPeak}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.total}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.discount}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.ft.toFixed(4)}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.billPeriod}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            columns: [
              { text: "฿", alignment: "left" },
              {
                text: `${formatNumberWithCommas(station.details.amount)}`,
                alignment: "right",
              },
            ],
            fontSize: 8,
            bold: true,
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
        ],
      };

      // headerTypeTOD
      let headerTypeTOD = {
        type: [
          {
            text: `ประเภท \n(Type)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `รวมจำนวนหน่วยที่ใช้\n(Total) kWh`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `ส่วนลด\n(Discount)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `อัตราไฟฟ้าผันแปร\n(ft)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `บิลประจำเดือน\n(Bill Perload)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
          {
            text: `รวมเงินค่าไฟฟ้าที่ต้องชำระ\n(Amount)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, false, true, true],
          },
        ],
        value: [
          {
            text: `${station.details.voltRate}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.total}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.discount}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.ft.toFixed(4)}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            text: `${station.details.billPeriod}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
          {
            columns: [
              { text: "฿", alignment: "left" },
              {
                text: `${formatNumberWithCommas(station.details.amount)}`,
                alignment: "right",
              },
            ],
            fontSize: 8,
            bold: true,
            fillColor: "#ddecf7",
            border: [true, false, true, true],
          },
        ],
      };

      let TableType = [
        {
          table: {
            widths:
              station.details.tariff === "TOU_FIX_TIME" || station.details.tariff === "TOU"
                ? ["6%", "14.4%", "14.4%", "14%", "10.18%", "9%", "10%", "22.02%"]
                : ["5.8%", "18.67%", "18.2%", "18%", "18%", "21.33%"],
            body: [
              ...(station.details.tariff === "TOU_FIX_TIME" || station.details.tariff === "TOU"
                ? [headerTypeTOU.type, headerTypeTOU.value]
                : [headerTypeTOD.type, headerTypeTOD.value]),
            ],
          },
          margin: [2, 0, 2, 0],
          layout: {
            paddingTop: function (i: number, node: any) {
              return 1;
            },
            paddingBottom: function (i: number, node: any) {
              return 1;
            },
            hLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            hLineColor: function (i: number, node: any) {
              return "#000000";
            },
            vLineColor: function (i: number, node: any) {
              return "#000000";
            },
          },
        },
      ]

      // solarDailyReportTOU
      let solarDailyReportTOU = {
        header: [
          {
            text: `Solar Rooftop Daily Report`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, true, true, true],
            colSpan: 5,
          },
          {},
          {},
          {},
          {},
        ],
        headermenu: [
          {
            text: `Date`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            // margin: [0, 5],
            margin: [0, 5, 0, 5], // ตั้งค่า margin บนล่างเล็กลง
          },
          {
            text: `Energy (kWp)\nOff Peak`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: `Energy (kWp)\nOn Peak`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: `Total\n(kWh)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: `Consumption\n(kWh)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
        ],
        value: station.details.daily.map((item: Daily) => [
          {
            text: `${formatDate(item.date)}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
          {
            text: item.offPeak,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
          {
            text: item.onPeak,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
          {
            text: item.total,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
          {
            text: item.consumption,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
        ]),
        total: [
          {
            text: "Total",
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: station.details.offPeak,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: station.details.onPeak,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: station.details.total,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: station.details.consumption,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
        ],
      };

      // solarDailyReportTOD
      let solarDailyReportTOD = {
        header: [
          {
            text: `Solar Rooftop Daily Report`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#9bc3e7",
            border: [true, true, true, true],
            colSpan: 3,
          },
          {},
          {},
        ],
        headermenu: [
          {
            text: `Date`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
            // margin: [0, 5],
            // margin: [0, 5, 0, 5], // ตั้งค่า margin บนล่างเล็กลง
          },
          {
            text: `Total (kWh)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: `Consumption (kWh)`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
        ],
        value: station.details.daily.map((item: Daily) => [
          {
            text: `${formatDate(item.date)}`,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
          {
            text: item.total,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
          {
            text: item.consumption,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
          },
        ]),
        total: [
          {
            text: "Total",
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: station.details.total,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
          {
            text: station.details.consumption,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#ddecf7",
          },
        ],
      };

      // solarTable
      let solarTable = {
        table: [
          {
            width: "49.32%",
            table: {
              widths:
                station.details.tariff === "TOU_FIX_TIME" || station.details.tariff === "TOU"
                  ? ["12.5%", "29.7%", "30.54%", "12%", "14.22%"]
                  : ["11.7%", "44.3%", "44%"],
              body:
                station.details.tariff === "TOU_FIX_TIME" || station.details.tariff === "TOU"
                  ? [
                    solarDailyReportTOU.header,
                    solarDailyReportTOU.headermenu,
                    ...solarDailyReportTOU.value,
                    solarDailyReportTOU.total,
                  ]
                  : [
                    solarDailyReportTOD.header,
                    solarDailyReportTOD.headermenu,
                    ...solarDailyReportTOD.value,
                    solarDailyReportTOD.total,
                  ],
            },
            margin: [2, 10, 2, 0],
            layout: {
              paddingTop: function (i: number, node: any) {
                return 1;
              },
              paddingBottom: function (i: number, node: any) {
                return 1;
              },
              hLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              vLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              hLineColor: function (i: number, node: any) {
                return "#000000";
              },
              vLineColor: function (i: number, node: any) {
                return "#000000";
              },
            },
          },
        ],
      };

      // description_equipment
      let description_equipment = {
        header: [
          {
            text: "Description equipment",
            alignment: "center",
            fontSize: 8,
            bold: true,
            fillColor: "#9bc3e7",
            border: [true, true, true, true],
            colSpan: 5,
          },
          {},
          {},
          {},
          {},
        ],
        headermenu: [
          {
            text: "Name",
            alignment: "center",
            fontSize: 8,
            bold: true,
            fillColor: "#ddecf7",
            border: [true, true, true, true],
          },
          {
            text: "Model",
            alignment: "center",
            fontSize: 8,
            bold: true,
            fillColor: "#ddecf7",
            border: [true, true, true, true],
          },
          {
            text: "Warranty",
            alignment: "center",
            fontSize: 8,
            bold: true,
            fillColor: "#ddecf7",
            border: [true, true, true, true],
          },
          {
            text: "",
            alignment: "center",
            fontSize: 8,
            bold: true,
            fillColor: "#ddecf7",
            border: [true, true, true, true],
          },
          {
            text: "Note",
            alignment: "center",
            fontSize: 8,
            bold: true,
            fillColor: "#ddecf7",
            border: [true, true, true, true],
          },
        ],
        value: station.details.devices.map((item: Device, index: number) => [
          {
            text: item.name,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
            border:
              index === 0
                ? [true, true, true, false]
                : index === 1
                  ? [true, false, true, false]
                  : [true, false, true, true],
          },
          {
            text: item.deviceType,
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
            border:
              index === 0
                ? [true, true, true, false]
                : index === 1
                  ? [true, false, true, false]
                  : [true, false, true, true],
          },
          {
            text: `${formatDate(item.exd_warranty)}` || "",
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
            border:
              index === 0
                ? [true, true, true, false]
                : index === 1
                  ? [true, false, true, false]
                  : [true, false, true, true],
          },
          {
            text: "",
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
            border:
              index === 0
                ? [true, true, true, false]
                : index === 1
                  ? [true, false, true, false]
                  : [true, false, true, true],
          },
          {
            text: '',
            fontSize: 8,
            bold: true,
            alignment: "center",
            fillColor: "#e2efda",
            border:
              index === 0
                ? [true, true, true, false]
                : index === 1
                  ? [true, false, true, false]
                  : [true, false, true, true],
          },
        ]),
      };

      // tou_tariff
      let tou_tariff = {
        tou: [
          {
            width: "48%",
            table: {
              widths: ["20%", "22%", "22%", "12%", "4%", "20%"],
              body: [
                [
                  {
                    text: "รายละเอียดการคิดค่าอัตราบริการไฟฟ้า (Description)",
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#9bc3e7",
                    border: [true, true, true, true],
                    colSpan: 6,
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                ],
                [
                  {
                    border: [true, true, true, false],
                    colSpan: 6,
                    table: {
                      widths: [
                        "16.66%",
                        "16.66%",
                        "16.66%",
                        "16.66%",
                        "16.66%",
                        "16.66%",
                      ],
                      body: [
                        [
                          {
                            text: `Erate อัตราตามช่วงเวลาของการใช้ (Time of Use Tariff : TOU Tariff)`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, false, true, true],
                            colSpan: 6,
                          },
                          {},
                          {},
                          {},
                          {},
                          {},
                        ],
                        [
                          {
                            text: "แรงดัน",
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                            rowSpan: 3,
                            margin: [0, 16],
                          },
                          {},
                          {
                            text: "ค่าพลังงานไฟฟ้า",
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                          {
                            text: "Discount 28%",
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                        ],
                        [
                          {},
                          {},
                          {
                            text: "(บาท/หน่วย)",
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                          {
                            text: "(บาท/หน่วย)",
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                        ],
                        [
                          {},
                          {},
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              {
                                text: "rate",
                                fontSize: 6,
                                baseline: "sub",
                              },
                              { text: "on", fontSize: 10 },
                            ],
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              {
                                text: "rate",
                                fontSize: 6,
                                baseline: "sub",
                              },
                              { text: "off", fontSize: 10 },
                            ],
                            bold: true,
                            alignment: "center",
                            fontSize: 8,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              {
                                text: "AD",
                                fontSize: 6,
                                baseline: "sub",
                              },
                              { text: "on", fontSize: 10 },
                            ],
                            bold: true,
                            alignment: "center",
                            fontSize: 8,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              {
                                text: "AD",
                                fontSize: 6,
                                baseline: "sub",
                              },
                              { text: "on", fontSize: 10 },
                            ],
                            bold: true,
                            alignment: "center",
                            fontSize: 8,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                        ],
                        [
                          {
                            text: `2.2.2 ต่ำกว่า 12 กิโลโวลต์`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                          {
                            text: `${station.details.onPeakRate}`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                          {
                            text: `${station.details.offPeakRate}`,
                            bold: true,
                            alignment: "center",
                            fontSize: 8,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                          {
                            text: `${station.details.onPeakRateDsc}`,
                            bold: true,
                            alignment: "center",
                            fontSize: 8,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                          {
                            text: `${station.details.offPeakRateDsc}`,
                            bold: true,
                            alignment: "center",
                            fontSize: 8,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 1,
                          },
                        ],
                        // Add more rows as needed
                      ],
                    },
                    margin: [20, 0, 20, 0],
                    layout: {
                      paddingTop: function (i: number, node: any) {
                        return 1;
                      },
                      paddingBottom: function (i: number, node: any) {
                        return 1;
                      },
                      hLineWidth: function (i: number, node: any) {
                        return 0.5; // All horizontal lines with 0.5 thickness
                      },
                      vLineWidth: function (i: number, node: any) {
                        return 0.5; // All vertical lines with 0.5 thickness
                      },
                      hLineColor: function (i: number, node: any) {
                        return "#000000"; // Color of horizontal lines
                      },
                      vLineColor: function (i: number, node: any) {
                        return "#000000"; // Color of vertical lines
                      },
                    },
                  },
                  {},
                  {},
                  {},
                  {},
                ],
                [
                  {
                    text: "รายการคํานวณค่าไฟฟ้า",
                    // alignment: "center",
                    fontSize: 8,
                    bold: true,
                    border: [true, false, true, false],
                    margin: [10, 5, 10, 0],
                    colSpan: 6,
                    decoration: "underline",
                  },
                ],
                [
                  {
                    image: `${images64.cal_tou}`,
                    width: 200,
                    height: 120,
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                    border: [true, false, true, true],
                    colSpan: 6,
                  },
                ],
              ],
              // margin: [0, 0, 0, 0],
            },

            margin: [10, 10, 2, 0],
            layout: {
              paddingTop: function (i: number, node: any) {
                return i === 1 ? 0 : 2;
              },
              hLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              vLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              hLineColor: function (i: number, node: any) {
                return "#000000";
              },
              vLineColor: function (i: number, node: any) {
                return "#000000";
              },
            },
          },
        ],
        unit: [
          {
            border: [true, false, true, true],
            colSpan: 6,
            table: {
              widths: ["10%", "65%", "15%", "10%"],
              body: [
                [
                  {
                    text: [
                      { text: "E", fontSize: 10 },
                      { text: "prod", fontSize: 6, baseline: "sub" },
                      { text: "on", fontSize: 10 },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `กําลังการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ในช่วง On Peak`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.onPeak}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Unit`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "E", fontSize: 10 },
                      { text: "prod", fontSize: 6, baseline: "sub" },
                      { text: "off", fontSize: 10 },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `กําลังการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ในช่วง Off Peak`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.offPeak}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `Unit`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: `Total(Unit)`,
                    alignment: "right",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                    colSpan: 2,
                  },
                  {},
                  {
                    text: `${station.details.total}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                  },
                  {
                    text: `Unit`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                  },
                ],
                [
                  {
                    text: `a`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    color: "#ffffff",
                    border: [true, false, true, true],
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                ],
                [
                  {
                    text: "Ft",
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `อัตราไฟฟ้าผันแปร (Ft) ตามประกาศของรอบเดือน มกราคม`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.ft.toFixed(4)}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "P", fontSize: 10 },
                      { text: "on", fontSize: 6, baseline: "sub" },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `ค่าไฟฟ้าช่วง on-peak`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${formatNumberWithCommas(station.details.onPeakAmount)}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "P", fontSize: 10 },
                      { text: "off", fontSize: 6, baseline: "sub" },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `ค่าไฟฟ้าช่วง off-peak`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `${formatNumberWithCommas(station.details.offPeakAmount)}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "P", fontSize: 10 },
                      { text: "on", fontSize: 6, baseline: "sub" },
                      { text: " + ", fontSize: 10 },
                      { text: "P", fontSize: 10 },
                      { text: "off ", fontSize: 6, baseline: "sub" },
                      { text: " ค่าไฟฟ้า", fontSize: 8 },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                    colSpan: 2,
                  },
                  {},
                  {
                    text: `${formatNumberWithCommas(totalAmount)}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                  },
                ],
              ],
            },
            margin: [10, 0, 2, 0],
            layout: {
              paddingTop: function (i: number, node: any) {
                return 1;
              },
              paddingBottom: function (i: number, node: any) {
                return 1;
              },
              hLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              vLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              hLineColor: function (i: number, node: any) {
                return "#000000";
              },
              vLineColor: function (i: number, node: any) {
                return "#000000";
              },
            },
          },
        ],
      };

      // tod_tariff
      let tod_tariff = {
        tod: [
          {
            width: "48%",
            table: {
              widths: ["20%", "22%", "22%", "12%", "4%", "20%"],
              body: [
                [
                  {
                    text: "รายละเอียดการคิดค่าอัตราบริการไฟฟ้า (Description)",
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#9bc3e7",
                    border: [true, true, true, true],
                    colSpan: 6,
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                ],
                [
                  {
                    border: [true, true, true, false],
                    colSpan: 6,
                    table: {
                      widths: ["10%", "26%", "26%", "9%", "19%", "10%"],
                      body: [
                        [
                          {
                            text: ``,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                          {
                            text: `Erate 2.1.2 ต่ำกว่า / กิโลโวลต์`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, false, true, true],
                            colSpan: 3,
                          },
                          {},
                          {},
                          {
                            text: `Discount 28%`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, false, true, true],
                            rowSpan: 2,
                            margin: [0, 7],
                          },
                          {
                            text: ``,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: ``,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                          {
                            text: "แรงดัน",
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                          {
                            text: "ค่าไฟฟ้า",
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                          },
                          {},
                          {
                            text: ``,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              { text: "rate", fontSize: 6, baseline: "sub" },
                              { text: "1", fontSize: 10 },
                            ],
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                          {
                            text: "150 หน่วย (กิโลวัตต์ชั่วโมง) แรก (หน่วยที่ 1 - 150)",
                            alignment: "left",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                          {
                            text: `${station.details.eRateMin}`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                          },
                          {
                            text: `${station.details.eRateMinDsc}`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                          },
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              { text: "AD", fontSize: 6, baseline: "sub" },
                              { text: "1", fontSize: 10 },
                            ],
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              { text: "rate", fontSize: 6, baseline: "sub" },
                              { text: "2", fontSize: 10 },
                            ],
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                          {
                            text: "250 หน่วยต่อไป (หน่วยที่ 151 - 400)",
                            alignment: "left",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                          {
                            text: `${station.details.eRateMid}`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                          },
                          {
                            text: `${station.details.eRateMidDsc}`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                          },
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              { text: "AD", fontSize: 6, baseline: "sub" },
                              { text: "2", fontSize: 10 },
                            ],
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                        ],
                        [
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              { text: "rate", fontSize: 6, baseline: "sub" },
                              { text: "3", fontSize: 10 },
                            ],
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                          {
                            text: "เกินกว่า 400 หน่วย (หน่วย 401 เป็นต้นไป)",
                            alignment: "left",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                            colSpan: 2,
                          },
                          {},
                          {
                            text: `${station.details.eRateMax}`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                          },
                          {
                            text: `${station.details.eRateMaxDsc}`,
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            fillColor: "#fce4d6",
                            border: [true, true, true, true],
                          },
                          {
                            text: [
                              { text: "E", fontSize: 10 },
                              { text: "AD", fontSize: 6, baseline: "sub" },
                              { text: "3", fontSize: 10 },
                            ],
                            alignment: "center",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false],
                          },
                        ],
                      ],
                    },
                    margin: [0, 0, 0, 0],
                    layout: {
                      paddingTop: function (i: number, node: any) {
                        return 1;
                      },
                      paddingBottom: function (i: number, node: any) {
                        return 1;
                      },
                      hLineWidth: function (i: number, node: any) {
                        return 0.5;
                      },
                      vLineWidth: function (i: number, node: any) {
                        return 0.5;
                      },
                      hLineColor: function (i: number, node: any) {
                        return "#000000";
                      },
                      vLineColor: function (i: number, node: any) {
                        return "#000000";
                      },
                    },
                  },
                  {},
                  {},
                  {},
                  {},
                ],
                [
                  {
                    text: "รายการคํานวณค่าไฟฟ้า",
                    // alignment: "left",
                    fontSize: 8,
                    bold: true,
                    border: [true, false, true, false],
                    margin: [10, 5, 10, 0],
                    colSpan: 6,
                    decoration: "underline",
                  },
                ],
                [
                  {
                    image: `${images64.cal_tod}`,
                    width: 200,
                    height: 110,
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                    border: [true, false, true, true],
                    colSpan: 6,
                  },
                ],
              ],
              margin: [0, 0, 0, 0],
            },

            margin: [10, 10, 2, 0],
            layout: {
              paddingTop: function (i: number, node: any) {
                return i === 1 ? 0 : 2;
              },
              paddingLeft: function (i: number, node: any) {
                return 0;
              },
              paddingRight: function (i: number, node: any) {
                return 0;
              },
              hLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              vLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              hLineColor: function (i: number, node: any) {
                return "#000000";
              },
              vLineColor: function (i: number, node: any) {
                return "#000000";
              },
            },
          },
        ],
        unit: [
          {
            border: [true, false, true, true],
            colSpan: 6,
            table: {
              widths: ["10%", "65%", "15%", "10%"],
              body: [
                [
                  {
                    text: [
                      { text: "E", fontSize: 9 },
                      { text: "prod", fontSize: 6, baseline: "sub" },
                      { text: "1", fontSize: 9 },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `กําลังการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ในช่วง 1-150 หน่วย`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.eRateMinTotal}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Unit`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "E", fontSize: 9 },
                      { text: "prod", fontSize: 6, baseline: "sub" },
                      { text: "2", fontSize: 9 },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `กําลังการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ในช่วง 151-400 หน่วย`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.eRateMidTotal}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Unit`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "E", fontSize: 9 },
                      { text: "prod", fontSize: 6, baseline: "sub" },
                      { text: "3", fontSize: 9 },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `กําลังการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ในช่วง 401 หน่วย เป็นต้นไป`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.eRateMaxTotal}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `Unit`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: `Total(Unit)`,
                    alignment: "right",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                    colSpan: 2,
                  },
                  {},
                  {
                    text: `${station.details.total}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                  },
                  {
                    text: `Unit`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                  },
                ],
                [
                  {
                    text: `a`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    color: "#ffffff",
                    border: [true, false, true, true],
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                ],
                [
                  {
                    text: "Ft",
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `อัตราไฟฟ้าผันแปร (Ft) ตามประกาศของรอบเดือน มกราคม`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.ft.toFixed(4)}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "P", fontSize: 10 },
                      { text: "1", fontSize: 6, baseline: "sub" },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `ผลรวมค่าไฟฟ้าในช่วง 1-150 หน่วย`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${station.details.eRateMinAmount}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "P", fontSize: 10 },
                      { text: "2", fontSize: 6, baseline: "sub" },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `ผลรวมค่าไฟฟ้าในช่วง 151-250 หน่วย`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `${formatNumberWithCommas(station.details.eRateMidAmount)}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, false],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "P", fontSize: 10 },
                      { text: "3", fontSize: 6, baseline: "sub" },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `ผลรวมค่าไฟฟ้าในช่วง 401 หน่วย เป็นต้นไป`,
                    alignment: "left",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `${formatNumberWithCommas(station.details.eRateMaxAmount)}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#e2efda",
                    border: [true, false, true, true],
                    // colSpan: 4,
                  },
                ],
                [
                  {
                    text: [
                      { text: "P", fontSize: 10 },
                      { text: "1", fontSize: 6, baseline: "sub" },
                      { text: " + ", fontSize: 10 },
                      { text: "P", fontSize: 10 },
                      { text: "2", fontSize: 6, baseline: "sub" },
                      { text: " + ", fontSize: 10 },
                      { text: "P", fontSize: 10 },
                      { text: "3 ", fontSize: 6, baseline: "sub" },
                      { text: " ค่าไฟฟ้า", fontSize: 8 },
                    ],
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                    colSpan: 2,
                  },
                  {},
                  {
                    text: `${station.details.amount}`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                    margin: [0, 1],
                  },
                  {
                    text: `Baht`,
                    alignment: "center",
                    fontSize: 8,
                    bold: true,
                    fillColor: "#bdd8ee",
                    border: [true, false, true, true],
                    margin: [0, 1],
                  },
                ],
              ],
            },
            margin: [10, 0, 2, 0],
            layout: {
              paddingTop: function (i: number, node: any) {
                return 1;
              },
              paddingBottom: function (i: number, node: any) {
                return 1;
              },
              hLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              vLineWidth: function (i: number, node: any) {
                return 0.5;
              },
              hLineColor: function (i: number, node: any) {
                return "#000000";
              },
              vLineColor: function (i: number, node: any) {
                return "#000000";
              },
            },
          },
        ],
      };

      let TableColumns = [
        {
          columns: [
            solarTable.table,
            // {
            //   width: "*",
            //   text: "",
            // },
            {
              stack: [
                {
                  width: "48%",
                  table: {
                    widths: ["31%", "33%", "12%", "4%", "20%"],
                    body: [
                      description_equipment.header,
                      description_equipment.headermenu,
                      ...description_equipment.value,
                    ],
                  },
                  margin: [10, 10, 2, 0],
                  layout: {
                    paddingTop: function (i: number, node: any) {
                      return 1;
                    },
                    paddingBottom: function (i: number, node: any) {
                      return 1;
                    },
                    hLineWidth: function (i: number, node: any) {
                      return 0.5; // All horizontal lines with 0.5 thickness
                    },
                    vLineWidth: function (i: number, node: any) {
                      return 0.5; // All vertical lines with 0.5 thickness
                    },
                    hLineColor: function (i: number, node: any) {
                      return "#000000"; // Color of horizontal lines
                    },
                    vLineColor: function (i: number, node: any) {
                      return "#000000"; // Color of vertical lines
                    },
                  },
                },
                station.details.tariff === "TOU_FIX_TIME" || station.details.tariff === "TOU"
                  ? tou_tariff.tou
                  : tod_tariff.tod,
                station.details.tariff === "TOU_FIX_TIME" || station.details.tariff === "TOU"
                  ? tou_tariff.unit
                  : tod_tariff.unit,
              ],
            },
          ],
        },
      ]

      NewPage.push(pageReport);
      NewPage.push(TableProjectDetail);
      NewPage.push(TableType);
      NewPage.push(TableColumns);
      if (filtered_graph_images[index]) {
        NewPage.push(filtered_graph_images[index]);
      }

      if (index < items.stations.length - 1) {
        NewPage.push({ text: "", pageBreak: "after" });
      }
    });

    const documentDefinition: any = {
      info: {
        title: "รายงานการใช้พลังงานไฟฟ้า",
      },
      pageMargins: [0, 0, 0, 0],
      content: [
        homepage,
        {
          text: "",
          pageBreak: "after",
        },
        contentBranch,
        {
          text: "",
          pageBreak: "after",
        },
        NewPage,
        // TableProjectDetail,
        // TableType,
        // TableColumns,
        // graph_image
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 0],
        },

      },
      defaultStyle: {
        font: "THSarabunNew",
      },
    };

    pdfMake.createPdf(documentDefinition).open();
    // pdfMake.createPdf(documentDefinition).download('รายงานการใช้พลังงานไฟฟ้า.pdf');
  } catch (error) {
    console.log(error)
  }
};

const formatDate = (dateString: any) => {
  if (!dateString) {
    return "";
  }

  const [day, month, year] = dateString.split("-");
  const formattedDay = parseInt(day, 10);
  return `${formattedDay}/${month}/${year}`;
}

const formatNumberWithCommas = (number: number | undefined): string => {
  if (number === undefined || number === null) {
    return "";
  }

  const fixedNumber = number.toFixed(2);

  return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// const parseMonthYear = (dateString: string) => {
//   const parts = dateString.split('/');
//   const month = parseInt(parts[0], 10);
//   const year = parseInt(parts[1], 10);

//   const thaiMonths = [
//     "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
//     "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
//   ];

//   return `${thaiMonths[month - 1]} ${year + 543}`;
// };

// const parseDate = (dateString: string) => {

//   const parts = dateString.split('-');
//   const day = parts[0];
//   const month = parseInt(parts[1], 10);
//   const year = parseInt(parts[2], 10);

//   const thaiMonths = [
//     "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
//     "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
//   ];

//   return `${day} ${thaiMonths[month - 1]} ${year + 543}`;
// };

const fetchChartData = async (endpoint: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}${endpoint}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data from ${url}`);
    }
    const data = await response.text(); // assuming the response is plain text
    return data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return null;
  }
};