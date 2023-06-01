export default function createBarChart(props) {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
        labels,
        datasets: [
            {
            label: 'Dataset 2',
            data: [100, 200, 2 , 100, 20, 30, 50, 50, 50, 50, 50, 50, 50,],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

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

    return { data, options}
}