$( document ).ready(function() {
var articles;
var $firstQuestionStep = $('.question-step.is-first')
var $articleCount = $('#article-count')
var $loadingSequence = $('.loading-sequence')
var $resetBtn = $('.reset')

$resetBtn.on('click', function(){
  location.reload()
})

Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1B2CVh-akXsNCnyP8UK3wMIwJEAFAAQqqnWI3XSlxRME/pubhtml',
 callback: function(data, tabletop) {
     articles = data
     articles.forEach(function(article,i){
       var articleTagString = article.tags
       var articleTagArray = article.tags.split(' ')
       articles[i].tags = articleTagArray
     })

    $articleCount.html('There are <span class="count-num">' + (articles.length * 9746) + '</span> stories at your fingertips.')

    makeExamples()

    $('body').show(400)
    $loadingSequence.remove();
    $firstQuestionStep.addClass('is-active')
 },
  simpleSheet: true,
  proxy: 'https://newsprojects.s3.amazonaws.com'
})

 function makeExamples() {
   $('.question-step button').each(function(){
     $el = $(this)
     var buttonTag = $el.attr('data-target-tags')
     $exampleLink = $el.parent().parent().find('a')
     var taggedArticles = findTaggedArticles(buttonTag)

     var exampleArticle = taggedArticles[Math.floor(Math.random()*taggedArticles.length)];

     if(exampleArticle == undefined) {
       $exampleLink.attr('href', '#')
       $exampleLink.text('')
       $el.parent().find('button').attr('disabled', 'disabled')
     }
     else {
      $exampleLink.attr('href', exampleArticle.url)
      $exampleLink.attr('target', '_blank')
      $exampleLink.text(exampleArticle.title)
     }
   })
 }

$('.question-step button').on('click', function(){
  var el = $(this)
  var questionParent = el.parents('.question-step')
  var title = questionParent.find('h2').text()
  var selectedButtonText = el.text();
  var selectedTags = el.attr('data-target-tags')


  var taggedArticles = findTaggedArticles(selectedTags)
  if(taggedArticles.length !== 0) {
    articles = taggedArticles;

    // This is useful if you want to show all the questions at once
    //questionParent.find('button').attr('disabled','disabled')
    $('#tags').append(selectedTags + ' + ')
    $('#custom-sentence').append('<p>'+ title + ' <strong>' + selectedButtonText.toLowerCase()+'</strong>. </p>')

    questionParent.removeClass('is-active')
    questionParent.next().addClass('is-active')

    if(!questionParent.next().hasClass('question-step')) {
      makeArticleList()
    }

    makeExamples()
    $articleCount.html('There are <span class="count-num">' + taggedArticles.length + '</span> stories at your fingertips.')
  }
  else {
    el.attr('disabled', 'disabled')
  }
})

function makeArticleList() {
  var articleList = d3.select('#relevant-articles')
  articleList.html('')

  var listArticles = articles
  if(listArticles.length > 5) { listArticles.length = 5}

  var articleEnter = articleList.selectAll('li')
    .data(articles)
    .enter().append('li')
    .html(function(d){
      return '<a target="_blank" href="' + d.url + '">' + d.title + '</a> <small style="color: #CCC; display: none;">' + JSON.stringify(d.tags) + '</small>';
  })
}

function findTaggedArticles(tag) {
  var relevantArticles = []
  articles.forEach(function(article){
    var tags = article.tags
    if(_.includes(tags, tag)) {
      relevantArticles.push(article)
    }
  })
  return relevantArticles
}

});
