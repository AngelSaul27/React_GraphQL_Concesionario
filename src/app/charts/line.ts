


export default function createLineChart(props) {

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: [100, 200, 2 , 100, 20, 30, 50, 50, 50, 50, 50, 50, 50,],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                type: 'bar',
                label: 'Dataset 2',
                data: [50, 50, 50, 50, 50, 200, 2 , 100, 20, 30, 50, 50, 100 ],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
    }

    return { data, labels, options}
}