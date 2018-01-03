const mainContainer = $('#main-container');
const chooseBankContainer = $('#choose-bank-container');

const createFeedback = (questionText, recordedText) => {
  // Create feedback
  let feedbackContainer = $('<div>', {
    class: 'row flex-center',
    id: 'feedback-container'
  });
  let card = $('<div>', { class: 'feedback-card' });

  let question = $('<h1>');
  question.text(questionText);
  let chart = $('<canvas>', {
    id: 'feedback-chart',
    width: '800',
    height: '400'
  });

  card.append(question);
  card.append(chart);

  let nextContainer = $('<div>', { class: 'col-md-12 flex-center' });
  let next = $('<span>', {
    class: 'fa fa-arrow-circle-right fa-5x',
    id: 'next'
  });

  nextContainer.append(next);

  feedbackContainer.append(card);
  feedbackContainer.append(nextContainer);

  $('#record-response-container').remove();
  mainContainer.append(feedbackContainer);

  // Calculate API

  // Build chart
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
};

const createTimer = question => {
  let recordResponseContainer = $('<div>', {
    class: 'row flex-center',
    id: 'record-response-container'
  });

  let timer = $('<div>', { class: 'col-md-12', id: 'timer' });
  timer.text('1:00');

  let qContainer = $('<div>', { class: 'col-md-12', id: 'question' });
  let text = $('<textarea>', { id: 'recorded-text', disabled: 'disabled' });
  let q = $('<h1>');
  q.text(question);

  qContainer.append(text);
  qContainer.append(q);

  let bContainer = $('<div>', { class: 'col-md-12', id: 'control-buttons' });
  let startButton = $('<div>', { class: 'btn mt-0', id: 'start' });
  let icon = $('<span>', { class: 'fa fa-play-circle fa-3x' });
  startButton.append(icon);
  bContainer.append(startButton);

  recordResponseContainer.append(timer);
  recordResponseContainer.append(qContainer);
  recordResponseContainer.append(bContainer);

  chooseBankContainer.remove();
  mainContainer.append(recordResponseContainer);
};

// Global questions
let Questions = [];
let index = 0;

// Timer
let timer = $('#timer');

let recordInterval = null;

const startTimer = recognition => {
  let count = 5;

  recordInterval = setInterval(function() {
    count -= 1;
    let seconds = count;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    $('#timer').text(`00:${seconds}`);
    console.log(count);
    if (count === 0) {
      clearInterval(recordInterval);
      let questionText = Questions[index];
      $('#record-response-container').remove();

      let recordedText = $('#recorded-text').text();

      recognition.stop();

      // Record recognition

      createFeedback(questionText, recordedText);
    }
  }, 1000);
};

try {
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new SpeechRecognition();

  recognition.continuous = true;

  // Chooses a question bank ( on click )
  $('.question-bank-card').click(function(e) {
    const bankId = $(this).data('id');

    axios
      .get(`/users/bank=${bankId}`)
      .then(response => {
        console.log(response);
        // Shuffle bank's questions
        Questions = response.data.questions;

        // Shuffles array
        Questions.sort((prev, curr) => {
          const positive = Math.random();
          const negative = Math.random() * -1;
          return positive + negative;
        });
        console.log(Questions);
        $('#content-title').html(
          "Record Your Response <span class='fa fa-battery-2'></span>"
        );
        index = 0;
        createTimer(Questions[index]);
      })
      .catch(err => console.log(err));
  });

  // Start Timer (change to event delegation)
  mainContainer.on('click', '#start', function(e) {
    startTimer(recognition);

    let rContainer = $('<div>', { class: 'btn mt-2', id: 'stop' });
    let removeButton = $('<span>', {
      class: 'fa fa-stop-circle fa-3x'
    });
    rContainer.append(removeButton);
    $(this).replaceWith(rContainer);
    recognition.start();
  });

  // Stop Timer (change to event delegation)
  mainContainer.on('click', '#stop', function(e) {
    clearInterval(recordInterval);
    let questionText = Questions[index];
    $('#record-response-container').remove();

    let recordedText = $('#recorded-text').text();

    recognition.stop();

    // Record recognition

    createFeedback(questionText, recordedText);
  });

  // Next Question
  mainContainer.on('click', '#next', function(e) {
    $('#feedback-container').remove();
    index++;
    if (index >= Questions.length) {
      console.log('Went through all the questions');
    } else {
      console.log('next');
      createTimer(Questions[index]);
    }
  });

  // Recognition event handling
  recognition.onstart = () => {
    console.log('Recording...');
  };

  recognition.onresult = function(event) {
    console.log('ON RESULT OCCURED');
    let recordedText = $('#recorded-text');
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      let old = recordedText.text();
      let newText = `${old}${event.results[i][0].transcript}.`;
      recordedText.text(newText);
      console.log(recordedText);
      console.log(newText);
    }
  };
} catch (e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}
