class GuestBook {
  constructor(targetBlock, url) {
    this.container = targetBlock;
    this.apiURL = url;
    this.getComments();
    this.initHandlers();
    this.checkButton();
  }

   httpGet(url) {
    return new Promise(function(resolve, reject) {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.onload = function() {
        if (this.status == 200) {
          resolve(this.response);
        } else {
          var error = new Error(this.statusText);
          error.code = this.status;
          reject(error);
        }
      };

      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };

      xhr.send();
    });
  }

  getComments() {
    this.httpGet(this.apiURL + '?action=index')
      .then(
        response => {
          this.comments = ($.trim(response) == '""') ? [] : JSON.parse(JSON.parse(response) );
        },
        error => {
          alert(`Rejected: ${error}`);
          console.error(`Rejected: ${error}`);
        }
      )
      .then(
        list => {
          this.renderComment( this.comments );
        }
      )
  }

  saveComments() {
    var xhr = new XMLHttpRequest();

    var body = 'action=update&data=' + JSON.stringify(this.comments);

    xhr.open("POST", this.apiURL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(body);
  }

  add() {
    let nicknameLink = `${this.container} input[name=nickname]`;
    let commentLink = `${this.container} input[name=comment]`;
    this.pushComment(this.comments, $(nicknameLink).val(), $(commentLink).val());
    this.clearInput(nicknameLink);
    this.clearInput(commentLink);
    this.checkButton();
    this.saveComments();
    this.renderComment(this.comments);
  }

  pushComment(list, nickname, comment) {
    list.push({
      user: nickname,
      comment: comment,
      vote: 0,
    });
  }

  clearInput(inputFieldLink) {
    $(inputFieldLink).val('');
  }

  validate(text) {
    return (text == "") ? false : true;
  }

  renderComment(list) {
    let html = '';
    for (let i of list) {
      html += this.templateItem(i.user, i.comment, i.vote);
    }
    $(`${this.container} #comment-list`).html(html);
  }

  templateItem(user, comment, vote) {
    return `
      <div class="item container-fluid ${ (vote < 0) ? 'disliked' : ''}  ${ (vote > 0) ? 'liked' : ''}">
        <div class="row">
          <div class="sidebar align-self-center">
            <button data-action="like" class = "btn btn-outline-primary">Like</button>
            <span class = "vote">${vote}</span>
            <button data-action="dislike" class = "btn btn-outline-danger">DisLike</button>
          </div>
          <div class="content align-self-center">
            <span class="user">${user}</span>:
            <span class="comment">${comment}</span>
          </div>
        </div>
      </div>
    `
  }

  checkButton() {
    let nickname = $(`${this.container} input[name=nickname]`);
    let comment = $(`${this.container} input[name=comment]`);
    let button = $(`${this.container} button[data-action=addComment]`);

    if ( this.validate( nickname.val() ) && this.validate( comment.val() ) ) {
      button.prop('disabled', false);
      button.removeClass('btn-light');
      button.addClass('btn-success');
    } else {
      button.prop('disabled', true);
      button.addClass('btn-light');
      button.removeClass('btn-success');
    };
  }

  upVote(element) {
    let elementId = this.findElementId(element);
    this.comments[elementId]['vote']++;
  }

  downVote(element) {
    let elementId = this.findElementId(element);
    this.comments[elementId]['vote']--;
  }

  findElementId(element) {
    let elementId = $(element.currentTarget).parents(`${this.container} .item`);
    return $(`${this.container} .item`).index(elementId);
  }

  initHandlers() {
    $(document).on("submit", `${this.container} form`,
                   (element) => {
                     element.preventDefault();
                     this.add();
                    });
    $(document).on("keyup", `${this.container} input[name=nickname]`,
                   () => {
                      this.checkButton();
                    });
    $(document).on("keyup", `${this.container} input[name=comment]`,
                   () => {
                      this.checkButton();
                    });
    $(document).on("click", `${this.container} button[data-action=like]`,
                   (e) => {
                    this.upVote(e);
                    this.saveComments();
                    this.renderComment(this.comments);
                  });
    $(document).on("click", `${this.container} button[data-action=dislike]`,
                   (e) => {
                    this.downVote(e);
                    this.saveComments();
                    this.renderComment(this.comments);
                  });
  }
}

$().ready(function() {
  new GuestBook("#guest-book", "http://localhost:8888/api.php/");
});
