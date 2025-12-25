class Game
{

    constructor()
    {
        this.mode = "normal";
        this.playerScore = 0;
        this.computerScore = 0;

        this.game_board = document.getElementById("game_board");
        this.winning_board = document.getElementById("winning_board");
        this.fire_overlay = document.getElementById("fire_overlay");
        this.label_result = document.getElementById("label_result");

        this.img_board_background = document.getElementById("img_board_background");

        this.score_player = document.getElementById("score_player");

        this.choice_rock = document.getElementById("choice_rock");
        this.choice_paper = document.getElementById("choice_paper");
        this.choice_scissors = document.getElementById("choice_scissors");
        this.choice_lizard = document.getElementById("choice_lizard");
        this.choice_spock = document.getElementById("choice_spock");

        this.button_again = document.getElementById("button_again");
        this.button_again.addEventListener("click", () => {
            this.winning_board.classList.add('hidden');
            this.game_board.classList.remove('hidden');
        });

        this.button_change_mode = document.getElementById("button_change_mode");
        this.button_change_mode.addEventListener("click", () => {
            if (this.mode === "normal")
            {
                this.mode = "utlimate";
                this.button_change_mode.textContent = "Change to Normal";
            }
            else
            {
                this.mode = "normal";
                this.button_change_mode.textContent = "Change to Ultimate";
            }
            this.buildMode(this.mode);
        });

        this.button_rules = document.getElementById("button_rules");
        this.button_rules.addEventListener("click", () => { this.openRules(); });

        this.choice_selected_player = document.getElementById("choice_selected_player");
        this.choice_selected_computer = document.getElementById("choice_selected_computer");

        this.player_selection = "";
        this.computer_selection = "";

        this.choice_paper.addEventListener("click", () => { this.takeTurn("paper"); });
        this.choice_rock.addEventListener("click", () => { this.takeTurn("rock"); });
        this.choice_scissors.addEventListener("click", () => { this.takeTurn("scissors"); });
        this.choice_lizard.addEventListener("click", () => { this.takeTurn("lizard"); });
        this.choice_spock.addEventListener("click", () => { this.takeTurn("spock"); });
    }

    buildMode(mode)
    {
        if(mode === "normal")
        {
            this.choices = [ "rock", "paper", "scissors" ];
            this.winning_board.classList.add('hidden');
            this.game_board.classList.remove('hidden');

            this.img_board_background.src = "./app/resources/assets/bg-triangle.svg";

            this.setChoicePosition(this.choice_rock, "pos3");
            this.setChoicePosition(this.choice_scissors, "pos2");
            this.setChoicePosition(this.choice_paper, "pos1");
            this.setChoicePosition(this.choice_lizard, "", true);
            this.setChoicePosition(this.choice_spock, "", true);
        }
        else if (mode === "utlimate")
        {
            this.choices = [ "rock", "paper", "scissors", "lizard", "spock"];
            this.winning_board.classList.add('hidden');
            this.game_board.classList.remove('hidden');

            this.img_board_background.src = "./app/resources/assets/bg-pentagon.svg";

            this.setChoicePosition(this.choice_scissors, "pos4");
            this.setChoicePosition(this.choice_spock, "pos5");
            this.setChoicePosition(this.choice_paper, "pos6");
            this.setChoicePosition(this.choice_lizard, "pos7");
            this.setChoicePosition(this.choice_rock, "pos8");
        }

        this.fire_overlay.classList.add("hide");
    }

    setChoicePosition(element, position, hidden = false)
    {
        element.classList.remove("pos1", "pos2", "pos3", "pos4", "pos5", "pos6", "pos7", "pos8");
        if (position !== "") element.classList.add(position);

        if (hidden)
        {
            element.classList.add("hidden");
        }
        else    
        {
            element.classList.remove("hidden");
        }
    }

    takeTurn(selected)
    {
        this.player_selection = selected;
        this.computer_selection = this.choices[Math.floor(Math.random() * this.choices.length)];

        let choice_selected_player_image = this.choice_selected_player.querySelector("img");
        let choice_selected_computer_image = this.choice_selected_computer.querySelector("img");

        choice_selected_player_image.src = `./app/resources/assets/icon-${this.player_selection}.svg`;
        choice_selected_computer_image.src = `./app/resources/assets/icon-${this.computer_selection}.svg`;
        
        this.fire_overlay.classList.remove("hide");
        let random_sound_number = Math.floor(Math.random() * 3) + 1;
        this.playSound("sound_choice_" + this.player_selection + "_" + random_sound_number + ".mp3", () => {
            this.evaluateWinner();
        });
    }

    evaluateWinner()
    {
        let result = "";
        let random_sound_number = Math.floor(Math.random() * 3) + 1;
        if (this.player_selection === this.computer_selection)
        {
            result = "draw";
            this.label_result.textContent = "It's a draw";
            this.choice_selected_player.classList.remove("winner");
            this.choice_selected_computer.classList.remove("winner");
            this.playSound("sound_draw_" + random_sound_number + ".mp3");
        }
        else if ((this.player_selection === "rock" && (this.computer_selection === "scissors" || this.computer_selection === "lizard")) ||
                 (this.player_selection === "paper" && (this.computer_selection === "rock" || this.computer_selection === "spock")) ||
                 (this.player_selection === "scissors" && (this.computer_selection === "paper" || this.computer_selection === "lizard")) ||
                 (this.player_selection === "lizard" && (this.computer_selection === "spock" || this.computer_selection === "paper")) ||
                 (this.player_selection === "spock" && (this.computer_selection === "scissors" || this.computer_selection === "rock")))
        {
            result = "player";
            this.playerScore += 1;
            this.label_result.textContent = "You win";
            this.choice_selected_player.classList.add("winner");
            this.choice_selected_computer.classList.remove("winner");
            this.playSound("sound_win_" + random_sound_number + ".mp3");
        }
        else
        {
            result = "computer";
            this.computerScore += 1;
            this.label_result.textContent = "You lose";
            this.choice_selected_computer.classList.add("winner");
            this.choice_selected_player.classList.remove("winner");
            this.playSound("sound_lose_" + random_sound_number + ".mp3");
        }

        this.winning_board.classList.remove('hidden');
        this.game_board.classList.add('hidden');
        this.fire_overlay.classList.add("hide");

        this.updateScore();
    }

    updateScore()
    {
        this.score_player.textContent = this.playerScore;
    }

    playSound(sound_name, callback = null)
    {
        let source_href = `./app/resources/sounds/${sound_name}`;
        const audio = new Audio(source_href);
        audio.play();

        if (callback !== null)
        {
            audio.addEventListener("ended", () => {
                callback();
            });
        }
    }

    openRules()
    {
        if(this.mode === "normal")
        {
            window.open("https://wrpsa.com/official-rps-rules/", "_blank");
        }
        else
        {
            window.open("https://bigbangtheory.fandom.com/wiki/Rock,_Paper,_Scissors,_Lizard,_Spock", "_blank");
        }
    }

}


document.addEventListener("DOMContentLoaded", function()
{
    const game = new Game();
    game.buildMode("normal");
});