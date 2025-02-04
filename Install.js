#feature-id    Script Name
#feature-info  Description of the script.
#feature-icon  URL_TO_ICON (optional)
#feature-category Utilities (or another relevant category)

function install() {
    var repo = "https://raw.githubusercontent.com/JohnBerger3000/Dead-Pixel-Zapper/scripts/";
    var scriptFile = "DeadPixelZapper.js"; // Change as needed

    var P = new Process;
    P.execute("wget", ["-O", scriptFile, repo + scriptFile]);
    console.writeln("Downloaded: " + scriptFile);
}

install();
