$(document).ready(function() {
  // Initialize Select2 on the country dropdown
  $('#country').select2();

  // Dynamically load all countries from countries.json
  $.getJSON('countries.json', function(data) {
    // data is expected to be an array of objects: { "code": "US", "name": "United States" }, etc.
    $.each(data, function(index, country) {
      var option = $('<option>').val(country.code).text(country.name);
      $('#country').append(option);
    });
    // Refresh Select2 to display the new options
    $('#country').trigger('change');
  });

  // Theme Toggle Functionality
  $('#theme-toggle').on('click', function() {
    $('body').toggleClass('dark-theme');
  });

  // Open the secret message page when "Read More" is clicked.
  $('.secret-read-more').on('click', function() {
    window.open('secret.html', '_blank');
  });

  // Open the resume page when "View Resume" is clicked.
  $('#view-resume').on('click', function() {
    window.open('resume.html', '_blank');
  });

  // Comment form submission
  $('#comment-form').on('submit', async function(e) {
    e.preventDefault();
    var commentText = $('#comment-text').val().trim();
    var country = $('#country').val();

    if (!commentText || !country) {
      alert('Please enter a comment and select your country.');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText, country: country })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const newComment = await response.json();
      renderComment(newComment);
      $('#comment-form')[0].reset();
      $('#comment-form')[0].reset();
      // Reset the Select2 dropdown
      $('#country').val('').trigger('change');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  });

  // Function to render a comment
  function renderComment(comment) {
    var $div = $('<div class="comment"></div>');
    $div.html('<p>' + comment.comment + ' - <strong>' + comment.country +
      '</strong> (' + new Date(comment.timestamp).toLocaleString() + ')</p>');
    $('#comments-list').append($div);
  }

  // Fetch and render existing comments on page load
  async function fetchComments() {
    try {
      const response = await fetch('/api/comments');
      const comments = await response.json();
      comments.forEach(renderComment);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
  fetchComments();
});
