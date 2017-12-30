const addBank = $('#add-bank');
const questionBanks = $('#main-container');

const createQuestionBank = () => {
  let card = $('<li>', { class: 'question-bank-card' });

  // Create label container
  let label = $('<div>', { class: 'question-bank-label' });
  let icon = $('<span>', { class: 'fa fa-question-circle-o fa-4x' });
  let title = $('<h1>');
  title.text('New Bank');

  let remove = $('<div>', { class: 'btn btn-3 remove-question-bank' });
  remove.text('Remove');

  label.append(icon);
  label.append(title);
  label.append(remove);

  // Create questions container
  let questions = $('<ul>', { class: 'list-group question-bank-questions' });

  let questionInput = $('<input>', {
    class: 'list-group-item list-group-item-info mt-2'
  });
  questionInput.attr('onKeyPress', 'onAdd(event, this)');
  let add = $('<div>', { class: 'btn btn-2 mt-2 add-question' });
  add.text('Add Question');

  questions.append(questionInput);
  questions.append(add);

  card.append(label);
  card.append(questions);

  questionBanks.append(card);
};

const createQuestion = scope => {
  let questionInput = scope.prev();
  let question = $('<li>', { class: 'list-group-item' });
  let remove = $('<span>', { class: 'fa fa-close ml-auto' });

  let text = questionInput.val().trim();
  if (text) {
    question.text(text);
    question.append(remove);
    question.insertBefore(questionInput);
    questionInput.val('');
  }
};

const onAdd = (event, scope) => {
  let code = event.keyCode ? event.keyCode : event.which;
  if (code == 13) {
    createQuestion($(scope).next());
  }
};

// Add new question bank
addBank.click(() => {
  createQuestionBank();
});

// Remove question bank
questionBanks.on('click', '.remove-question-bank', function(event) {
  $(this).parent().parent().remove();
});

// Edits title
questionBanks.on('click', 'h1', function(event) {
  let title = $('<input>', { class: 'title' });
  title.val($(this).text());
  let card = $(this).parent().parent();
  card.click(function() {
    let newTitle = $('<h1>', { class: 'title' });
    newTitle.text(title.val());
    title.replaceWith(newTitle);
  });
  title.click(function(event) {
    event.stopPropagation();
  });

  $(this).replaceWith(title);
});

// Remove question
questionBanks.on('click', '.fa-close', function(event) {
  $(this).parent().remove();
});

// Add question
questionBanks.on('click', '.add-question', function(event) {
  createQuestion($(this));
});
