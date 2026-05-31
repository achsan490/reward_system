"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TrendingUp, DollarSign, Award } from "lucide-react";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface DashboardChartProps {
    data: {
        date: string;
        totalSpent: number;
        totalPoints: number;
    }[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
    const categories = data.map((d) => d.date);
    const spentData = data.map((d) => d.totalSpent);
    const pointsData = data.map((d) => d.totalPoints);

    // Calculate statistics
    const totalSpent = spentData.reduce((a, b) => a + b, 0);
    const totalPoints = pointsData.reduce((a, b) => a + b, 0);
    const avgSpent = spentData.length > 0 ? totalSpent / spentData.length : 0;

    const options: ApexOptions = {
        chart: {
            fontFamily: "'Inter', 'Satoshi', sans-serif",
            height: 380,
            type: "area",
            dropShadow: {
                enabled: true,
                color: "#000",
                top: 8,
                left: 0,
                blur: 10,
                opacity: 0.08,
            },
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: ["#6366f1", "#10b981"],
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.4,
                gradientToColors: ["#818cf8", "#34d399"],
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        stroke: {
            width: [3, 3],
            curve: "smooth",
            lineCap: "round",
        },
        labels: categories,
        grid: {
            show: true,
            borderColor: "#e5e7eb",
            strokeDashArray: 3,
            position: "back",
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 10,
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 5,
            colors: ["#fff"],
            strokeColors: ["#6366f1", "#10b981"],
            strokeWidth: 3,
            strokeOpacity: 1,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            hover: {
                size: 7,
                sizeOffset: 2,
            },
        },
        xaxis: {
            type: "category",
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: "#64748b",
                    fontSize: "13px",
                    fontWeight: 500,
                },
            },
        },
        yaxis: [
            {
                title: {
                    text: "Total Belanja (Rp)",
                    style: {
                        color: "#64748b",
                        fontSize: "12px",
                        fontWeight: 600,
                    },
                },
                labels: {
                    style: {
                        colors: "#64748b",
                        fontSize: "12px",
                    },
                    formatter: function (val) {
                        return "Rp " + (val / 1000000).toFixed(1) + "jt";
                    },
                },
            },
            {
                opposite: true,
                title: {
                    text: "Total Poin",
                    style: {
                        color: "#64748b",
                        fontSize: "12px",
                        fontWeight: 600,
                    },
                },
                labels: {
                    style: {
                        colors: "#64748b",
                        fontSize: "12px",
                    },
                    formatter: function (val) {
                        return val.toFixed(0);
                    },
                },
            },
        ],
        legend: {
            show: false,
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: "light",
            style: {
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
            },
            y: [
                {
                    formatter: function (val) {
                        return "Rp " + val.toLocaleString("id-ID");
                    },
                },
                {
                    formatter: function (val) {
                        return val.toLocaleString("id-ID") + " poin";
                    },
                },
            ],
            marker: {
                show: true,
            },
        },
        responsive: [
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 300,
                    },
                },
            },
        ],
    };

    const series = [
        {
            name: "Total Belanja",
            data: spentData,
        },
        {
            name: "Poin Didapat",
            data: pointsData,
        },
    ];

    return (
        <div className="col-span-12 xl:col-span-8">
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                {/* Header Section */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-green-50 px-6 py-5 dark:border-gray-800 dark:from-gray-800 dark:to-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Analisis Performa
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Tren belanja & poin 6 bulan terakhir
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <div className="rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Rata-rata/bulan</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    Rp {(avgSpent / 1000000).toFixed(1)}jt
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                            <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Belanja</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                Rp {(totalSpent / 1000000).toFixed(1)}jt
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Poin</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {totalPoints.toLocaleString("id-ID")} poin
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="px-4 py-6">
                    <div id="dashboardChart" className="w-full">
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="area"
                            height={380}
                            width={"100%"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
