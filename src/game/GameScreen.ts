import {Screen} from "../engine/Screen";
import {Player} from "./Player";
import {Sprite} from "../engine/Sprite";
import {Caption} from "../engine/Caption";
import {Layer} from "../engine/Layer";
import {EnemiesLayer} from "./EnemiesLayer";
import {RocketsLayer} from "./RocketsLayer";
import {ImgResOutput} from "../engine/Loader";

export class GameScreen extends Screen {
    static SCR_WIDTH = 405;
    static SCR_HEIGHT = 720;

    // Game Elements
    private player: Player;
    private background: Sprite;
    private overflow: Sprite;

    private livesIcon: Sprite;
    private gameStatusCaption: Caption;
    private numberOfLivesCaption: Caption;

    // Layers
    private playerLayer: Layer;
    private backgroundLayer: Layer;
    private uiLayer: Layer;
    private enemiesLayer: EnemiesLayer;
    private rocketsLayer: RocketsLayer;

    private numberOfLives = 3;
    private shakeScreenCount = 0;
    private fire = false;
    private lastShotTime: number = 0;

    constructor(images: ImgResOutput) {
        super(GameScreen.SCR_WIDTH, GameScreen.SCR_HEIGHT, true);

        this.player = new Player(images.player,
            50, -100, GameScreen.SCR_WIDTH + 100);
        this.background = new Sprite(images.background);
        this.overflow = new Sprite(images.overflow);

        this.livesIcon = new Sprite(images.player);
        this.gameStatusCaption = new Caption('You WIN!', 'white', 'center', '20px Arial');
        this.numberOfLivesCaption = new Caption('3', 'white', 'start', '16px Arial');

        // Layers
        this.playerLayer = new Layer();
        this.backgroundLayer = new Layer();
        this.enemiesLayer = new EnemiesLayer(images.enemy, this.onEvent.bind(this));
        this.rocketsLayer = new RocketsLayer(images.rocket,
            20, this.enemiesLayer, this.player, this.onEvent.bind(this));
        this.uiLayer = new Layer();


        this.add(this.backgroundLayer.add(this.background))
            .add(this.rocketsLayer)
            .add(this.playerLayer.add(this.player,
                GameScreen.SCR_WIDTH / 2 - this.player.width / 2,
                GameScreen.SCR_HEIGHT - this.player.height - 80))
            .add(this.enemiesLayer, 0, 100)
            .add(this.uiLayer
                .add(this.livesIcon, 10, screen.height - 60)
                .add(this.numberOfLivesCaption,
                    this.livesIcon.x + this.livesIcon.width + 15, this.livesIcon.y + this.livesIcon.height / 2 - 5)
                .add(this.overflow)
                .add(this.gameStatusCaption, screen.width / 2, screen.height / 2)
            );

        this.overflow.visibility = false;
        this.gameStatusCaption.visibility = false;

        this.addEventListeners();
    }

    protected step() {
        if (this.fire) this.launch();
        this.shakeScreen();
    }

    private addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft') this.player.accelerationLeft = 50;
            if (e.code === 'ArrowRight') this.player.accelerationRight = 50;
            if (e.code === 'Space') {
                this.fire = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft') this.player.accelerationLeft = 0;
            if (e.code === 'ArrowRight') this.player.accelerationRight = 0;
            if (e.code === 'Space') {
                this.fire = false;
            }
        });
    }

    private onEvent(e: { event: string }) {
        switch (e.event) {
            case 'enemyDestroyed':
                this.enemiesLayer.level = this.enemiesLayer.level + 0.1;
                break;
            case 'damage':
                this.numberOfLives--;
                this.shakeScreenCount = 10;
                this.numberOfLivesCaption.text = this.numberOfLives.toString();
                if (!this.numberOfLives) this.onEvent({event: 'gameover'});
                break;
            case 'won':
                this.isRunning = false;
                this.overflow.visibility = true;
                this.gameStatusCaption.text = 'You WIN!';
                this.gameStatusCaption.visibility = true;
                break;
            case 'gameover':
                this.isRunning = false;
                this.overflow.visibility = true;
                this.gameStatusCaption.text = 'Game Over';
                this.gameStatusCaption.visibility = true;
                break;
        }
    }

    private launch() {
        if (new Date().getTime() - this.lastShotTime < 100) return;

        this.player.fire();
        this.rocketsLayer.launch(this.player.x + this.player.width / 2, this.player.y - 30);

        this.lastShotTime = new Date().getTime();
    }

    private shakeScreen() {
        if (!this.shakeScreenCount) {
            this.x = 0;
            this.y = 0;
            return;
        }
        this.shakeScreenCount--;

        this.x = Math.random() * 20 - 10;
        this.y = Math.random() * 20 - 10;
    }
}