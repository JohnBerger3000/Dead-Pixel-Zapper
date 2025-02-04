// Dead Pixel Zapper (DPZ) – Single "Strength" Slider
// Large "Dead Pixel Zapper" at the top, then "© 2025 Oscar" & V1.0 on the left,
// 0..1 => threshold in [0..1], kernel in [3,5,7,9,11].

#feature-id Utilities > DPZ
#feature-info Minimal script for removing dead pixels, with a single "strength" slider.

#include <pjsr/Sizer.jsh>
#include <pjsr/FrameStyle.jsh>

function PixelMathDialog()
{
   this.__base__ = Dialog;
   this.__base__();

   // Strength default
   this.strength = 0.5;

   // 1) Large "Dead Pixel Zapper" at the top, centered
   this.labelTitle = new Label(this);
   this.labelTitle.text = "Dead Pixel Zapper";
   let bigFont = new Font("Sans", 14);
   bigFont.bold = true;
   this.labelTitle.font = bigFont;
   this.labelTitle.textAlignment = 1; // Center

   let rowTitle = new HorizontalSizer;
   rowTitle.spacing = 6;
   rowTitle.addStretch();
   rowTitle.add(this.labelTitle);
   rowTitle.addStretch();

   // 2) "© 2025 Oscar" + "V1.0" on the left
   this.labelOscar = new Label(this);
   this.labelOscar.text = "© 2025 Oscar";
   this.labelOscar.textAlignment = 0; // Left
   this.labelOscar.font = new Font("Sans", 8);

   this.labelVersion = new Label(this);
   this.labelVersion.text = "V1.0";
   this.labelVersion.textAlignment = 0; // Left
   this.labelVersion.font = new Font("Sans", 8);

   let colOscar = new VerticalSizer;
   colOscar.spacing = 0;
   colOscar.add(this.labelOscar);
   colOscar.add(this.labelVersion);
   colOscar.addStretch();

   let rowOscar = new HorizontalSizer;
   rowOscar.spacing = 6;
   rowOscar.add(colOscar);
   rowOscar.addStretch();

   // 3) Strength label + slider + readout
   this.strengthText = new Label(this);
   this.strengthText.text = "Strength:";
   this.strengthText.textAlignment = 2; // Right

   this.strengthSlider = new Slider(this);
   this.strengthSlider.setRange(0, 100);
   this.strengthSlider.minWidth = 200;
   this.strengthSlider.pageSize = 10;
   this.strengthSlider.tickInterval = 10;
   this.strengthSlider.value = 50; // => 0.5

   this.strengthValueLabel = new Label(this);
   this.strengthValueLabel.text = "0.50";
   this.strengthValueLabel.textAlignment = 1; // Center

   this.strengthSlider.onValueUpdated = function(v)
   {
      let s = v / 100.0;
      this.dialog.strength = s;
      this.dialog.strengthValueLabel.text = s.toFixed(2);
      console.noteln("[SLIDER] Strength updated to " + s.toFixed(2));
   }.bind(this);

   let rowStrength = new HorizontalSizer;
   rowStrength.spacing = 6;
   rowStrength.add(this.strengthText);
   rowStrength.add(this.strengthSlider, 100);
   rowStrength.add(this.strengthValueLabel);
   rowStrength.addStretch();

   // Single-image Apply (active window)
   this.applyButton = new PushButton(this);
   this.applyButton.text = "Apply (Active Image)";
   this.applyButton.onClick = function()
   {
      applyStrengthPixelMath(this.dialog);
   }.bind(this);

   let rowButtons = new HorizontalSizer;
   rowButtons.spacing = 6;
   rowButtons.addStretch();
   rowButtons.add(this.applyButton);
   rowButtons.addStretch();

   // Final UI layout setup
   this.sizer = new VerticalSizer;
   this.sizer.margin = 10;
   this.sizer.spacing = 6;
   this.sizer.add(rowTitle);
   this.sizer.add(rowOscar);
   this.sizer.add(rowStrength);
   this.sizer.add(rowButtons);

   this.adjustToContents();
}

PixelMathDialog.prototype = new Dialog;

function applyStrengthPixelMath(dlg)
{
   let W = ImageWindow.activeWindow;
   if (!W || W.isNull)
   {
      console.criticalln("No active image to apply PixelMath.");
      return;
   }
   processOneWindow(W, dlg.strength);
}

function processOneWindow(win, strength)
{
   let threshold = strength;
   let kernelIndex = Math.floor(4 * strength + 0.5); // 0..4
   let kernelSize = 3 + 2 * kernelIndex;

   let expr =
      "iif($T < " + threshold +
      ", medfilt(medfilt(medfilt(medfilt($T, " + kernelSize + "), " + kernelSize + "), " + kernelSize + "), " + kernelSize + "), $T)";

   console.noteln("[DPZ] PixelMath expression: " + expr);

   let P = new PixelMath;
   P.expression = expr;
   P.createNewImage = false;
   P.executeOn(win.mainView);

   console.noteln("Dead Pixel Removal Successful on: " + win.mainView.id);
   console.noteln("Used threshold=" + threshold.toFixed(3) + ", kernel=" + kernelSize);
}

var dialog = new PixelMathDialog();
dialog.execute();
