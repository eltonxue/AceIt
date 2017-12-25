let timer = $('#timer');

let recordInterval = null;
const startRecording = () => {
  let count = 0;

  recordInterval = setInterval(function() {
    count += 1;
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    // Checks for double digits
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    $('#timer').text(`${minutes}:${seconds}`);
    console.log(count);
  }, 1000);
};

$('#start').on('click', function(e) {
  startRecording();
});

$('#stop').on('click', function(e) {
  clearInterval(recordInterval);
});

Chart.defaults.global.defaultFontColor = 'white';
var ctx = document.getElementById('feedback-chart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [
      'Anger',
      'Fear',
      'Joy',
      'Sadness',
      'Analytical',
      'Confident',
      'Tentative'
    ],
    datasets: [
      {
        label: 'Feedback',
        data: [0.4, 0.3, 0.7, 0.1, 0.4, 0.9, 0.5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255,99,132,1)'
        ],
        borderWidth: 2
      }
    ]
  },
  options: {
    legend: {
      display: false
    },
    responsive: false,
    scales: {
      xAxes: [
        {
          ticks: {
            fontSize: 20
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            max: 1,
            fontSize: 20,
            min: 0
          }
        }
      ]
    }
  }
});
