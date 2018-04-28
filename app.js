class GuestBook {
  constructor(targetBlock) {
    this.container = targetBlock;
    this.storageKey = `${this.container}-local-storage`;
    this.comments = this.getComments();
    this.initHandlers();
    this.checkButton();
    this.renderComment(this.comments);
  }

  getComments() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  saveComments() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
  }

  add() {
    let nickname = $(`${this.container} input[name=nickname]`);
    let comment = $(`${this.container} input[name=comment]`);
    this.pushComment(this.comments, nickname.val(), comment.val());
    this.clearInput(nickname);
    this.clearInput(comment);
    this.checkButton();
    this.saveComments();
    this.renderComment(this.comments);
  }

  pushComment(list, nickname, comment) {
    list.push({
      user: nickname,
      comment: comment,
      vote: 0
    });
  }

  clearInput(inputField) {
    inputField.val('');
  }

  validate(input) {
    if (input == "") {
      return false
    } else {
      return true
    };
  }

  renderComment(list) {
    let html = '';
    for (let i of list) {
      html += this.templateItem(i.user, i.comment, i.liked, i.disliked);
    }
    $(`${this.container} #comment-list`).html(html);
  }

  templateItem(user, comment, like, dislike) {
    return `
      <div class="item container-fluid">
        <div class="row">
          <div class="col-8">
            <span class="user">${user}</span>:
            <span class="user">${comment}</span>
          </div>
          <div class="col-4 justify-content-md-center">
            <button data-action="like" class = "btn ${like ? 'btn-primary' : 'btn-outline-primary'}">Like</button>
            <button data-action="dislike" class = "btn ${dislike ? 'btn-danger' : 'btn-outline-danger'}">DisLike</button>
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

  toggleLike(element) {
    let elementId = this.findElementId(element);
    this.comments[elementId]['liked'] = !this.comments[elementId]['liked'];
  }

  toggleDislike(element) {
    let elementId = this.findElementId(element);
    this.comments[elementId]['disliked'] = !this.comments[elementId]['disliked'];
  }

  findElementId(element) {
    let elementId = $(element.currentTarget).parents(`${this.container} .item`);
    return $(`${this.container} .item`).index(elementId);
  }

  initHandlers() {
    $(document).on("submit", `${this.container} form`,
                   (element) => {
                      this.add();
                      element.preventDefault();
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
                    this.toggleLike(e);
                    this.saveComments();
                    this.renderComment(this.comments);
                  });
     $(document).on("click", `${this.container} button[data-action=dislike]`,
                   (e) => {
                    this.toggleDislike(e);
                    this.saveComments();
                    this.renderComment(this.comments);
                  });
  }
}

$().ready(function() {
  new GuestBook("#guest-book");
});
