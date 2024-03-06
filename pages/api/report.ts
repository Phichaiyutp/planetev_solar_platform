import { NextApiRequest, NextApiResponse } from 'next';

const report = async (selectedStation: string, selectedYear: string, selectedMonth: string) => {
    try {
        const hostReport = process.env.NEXT_PUBLIC_HOST_REPORT || "planetev_report";
        const portReport = process.env.NEXT_PUBLIC_HOST_PORT_REPORT || 5000;
        const response = await fetch(`http://${hostReport}:${portReport}/download/xlsx/${selectedStation}?year=${selectedYear}&month=${selectedMonth}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
        });
        const data = await response.arrayBuffer();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { selectedStation, selectedYear, selectedMonth } = req.query;

    if (!selectedStation || !selectedYear || !selectedMonth) {
        res.status(400).json({ error: 'Missing parameters' });
        return;
    }

    const reportData = await report(selectedStation as string, selectedYear as string, selectedMonth as string);
    
    if(reportData) {
        res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send(Buffer.from(reportData));
    } else {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default handler;
