import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Card, CardContent, Typography, Box, CircularProgress, Alert
} from '@mui/material';

const MonthlyProvChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#9c755f', '#bab0ac'];
  const MAX_PAGES_TO_FETCH = 30;

  useEffect(() => {
    const pageSize = 50;
    let allData = [];

    const initFetch = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(0);

        const firstPageResponse = await axios.get('http://localhost:8080/apiV1/casestudy', {
          params: {
            page: 0,
            size: pageSize,
            sort: 'movementDate,asc'
          }
        });

        if (firstPageResponse.data && firstPageResponse.data.page) {
          const { totalPages: pages } = firstPageResponse.data.page;
          const pagesToFetch = Math.min(pages, MAX_PAGES_TO_FETCH);
          setTotalPages(pagesToFetch);

          if (firstPageResponse.data._embedded && firstPageResponse.data._embedded.caseStudyList) {
            allData = [...allData, ...firstPageResponse.data._embedded.caseStudyList];
            setLoadingProgress(1 / pagesToFetch * 100);
          }

          await fetchRemainingPages(pagesToFetch, pageSize, allData);
        } else {
          throw new Error('Invalid response format: pagination info missing');
        }
      } catch (err) {
        console.error('Error during initial data fetch:', err);
        setError(`Failed to load data: ${err.message}`);
        setIsLoading(false);
      }
    };

    const fetchRemainingPages = async (totalPages, pageSize, currentData) => {
      try {
        for (let page = 1; page < totalPages; page++) {
          const response = await axios.get('http://localhost:8080/apiV1/casestudy', {
            params: {
              page: page,
              size: pageSize,
              sort: 'movementDate,asc'
            }
          });

          if (response.data._embedded && response.data._embedded.caseStudyList) {
            currentData = [...currentData, ...response.data._embedded.caseStudyList];
            setLoadingProgress(((page + 1) / totalPages) * 100);
          }
        }

        processData(currentData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching additional pages:', err);
        setError(`Failed to load full data: ${err.message}`);

        if (currentData.length > 0) {
          processData(currentData);
        }
        setIsLoading(false);
      }
    };

    initFetch();
  }, []);

  const processData = (rawData) => {
    const groupedByMonth = {};
    const provTypes = new Set();

    rawData.forEach(item => {
      if (!item.movementDate || !item.prov2) return;

      const date = new Date(item.movementDate);
      const monthYear = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;

      const provKey = item.prov2.match(/[A-Za-z]/g)?.join('') || 'Unknown';

      provTypes.add(provKey);

      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = {};
      }

      if (!groupedByMonth[monthYear][provKey]) {
        groupedByMonth[monthYear][provKey] = 0;
      }

      groupedByMonth[monthYear][provKey] += 1;
    });

    const chartData = Object.keys(groupedByMonth).map(monthYear => {
      const monthData = { month: monthYear };

      Array.from(provTypes).forEach(prov => {
        monthData[prov] = groupedByMonth[monthYear][prov] || 0;
      });

      return monthData;
    });

    chartData.sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');

      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB);
      }

      const monthsOrder = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };

      return monthsOrder[monthA] - monthsOrder[monthB];
    });

    setData(chartData);
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading data ({Math.round(loadingProgress)}%)
        </Typography>
        <Typography variant="caption" sx={{ mt: 1 }}>
          Loading page {Math.ceil(loadingProgress / 100 * totalPages)} of {totalPages} (Limited to {MAX_PAGES_TO_FETCH} pages for testing)
        </Typography>
      </Box>
    );
  }

  if (error && data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const provTypes = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'month') 
    : [];

  return (
    <Card elevation={3} sx={{ marginBottom: 4, position: 'relative' }}>
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#2c3e50',
            fontFamily: "'Kdam Thmor Pro', sans-serif",
          }}
        >
          Provenance by Month
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error} (Showing partial data)
          </Alert>
        )}

        {/* Filtro estático com o texto "Jun 2023" no canto superior direito */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: '#f1f1f1',
            padding: '4px 12px',
            borderRadius: 4,
            fontWeight: 600,
            color: '#2c3e50',
            fontFamily: "'Kdam Thmor Pro', sans-serif",
            boxShadow: 2,
          }}
        >
          Jun 2023
        </Box>

        <Box sx={{ width: '100%', height: 500 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 30, left: 100, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                label={{ value: 'Count', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                type="category"
                dataKey="month"
                tick={{ fontSize: 12, fontFamily: "'Kdam Thmor Pro', sans-serif" }}
              />
              <Tooltip
                formatter={(value, name) => [`${value} units`, `Prov: ${name}`]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontFamily: "'Kdam Thmor Pro', sans-serif" }}
                formatter={(value) => `Prov: ${value}`}
              />
              {provTypes.map((prov, index) => (
                <Bar
                  key={prov}
                  dataKey={prov}
                  fill={colors[index % colors.length]}
                  name={prov}
                  stackId="a"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>

  );
};

export default MonthlyProvChart;
