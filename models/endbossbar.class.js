class EndBossBar extends StatusBar {
  width = 250;
  height = 100;
  x = 480;
  y = -20;

  // Nutzt die vorhandenen Healthbar-Bilder, damit keine 404-Logs mehr entstehen
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }
}
