window.addEventListener("load", function () {
  let countUser = document.querySelector(".count-user"),
    countComp = document.querySelector(".count-comp"),
    userField = document.querySelector(".user-field"),
    compField = document.querySelector(".comp-field"),
    sound = document.querySelector(".sound"),
    res = document.querySelector(".result"),
    play = document.querySelector(".play"),
    fields,
    userStep,
    compStep,
    countU = 0,
    countC = 0,
    blocked = false;

  const figureContainer = document.querySelector(".figure-container");
  if (!figureContainer) {
    console.error("Ошибка: контейнер .figure-container не найден.");
    return;
  }

  if (!userField) {
    userField = document.createElement("div");
    userField.className = "user-field";
    userField.innerHTML = `
          <button class="field rock" data-field="r"></button>
          <button class="field scissors" data-field="s"></button>
          <button class="field paper" data-field="p"></button>
        `;
    figureContainer.prepend(userField);
  }

  fields = document.querySelectorAll(".field");

  function choiceUser(e) {
    if (blocked) return;
    let target = e.target;
    if (!target.classList.contains("field") || !target.dataset.field) {
      console.error("Ошибка: некорректный выбор.");
      return;
    }
    userStep = target.dataset.field;
    fields.forEach((item) => item.classList.remove("active", "error"));
    target.classList.add("active");
    choiceComp();
  }

  function choiceComp() {
    blocked = true;
    let rand = Math.floor(Math.random() * 3);
    compField.classList.add("blink");
    let compFields = compField.querySelectorAll(".field");

    setTimeout(() => {
      compField.classList.remove("blink");
      compStep = compFields[rand].dataset.field;
      compFields[rand].classList.add("active");
      winner();
    }, 1000);
  }

  function winner() {
    blocked = false;

    let comb = userStep + compStep;

    switch (comb) {
      case "rr":
      case "ss":
      case "pp":
        res.innerText = "Ничья!";
        sound.setAttribute("src", "audio/draw.mp3");
        sound.play();
        break;

      case "rs":
      case "sp":
      case "pr":
        res.innerText = "Победили вы!";
        sound.setAttribute("src", "audio/win.mp3");
        sound.play();
        countU++;
        countUser.innerText = countU;
        compField
          .querySelector(`[data-field=${compStep}]`)
          .classList.add("error");
        break;

      case "sr":
      case "ps":
      case "rp":
        res.innerText = "Победил компьютер!";
        sound.setAttribute("src", "audio/loss.mp3");
        sound.play();
        countC++;
        countComp.innerText = countC;
        compField
          .querySelector(`[data-field=${compStep}]`)
          .classList.add("error");
        break;

      default:
        console.error(
          `Неизвестная комбинация: ${comb}. Возможно, ошибка в логике.`
        );
    }
  }

  function playGame() {
    countU = countC = 0;
    res.innerText = "Сделайте выбор";
    countUser.innerText = "0";
    countComp.innerText = "0";
    fields.forEach((item) => item.classList.remove("active", "error"));
    compField.querySelectorAll(".field").forEach((item) => {
      item.classList.remove("active", "error");
    });
  }

  play.addEventListener("click", playGame);
  userField.addEventListener("click", choiceUser);
});
