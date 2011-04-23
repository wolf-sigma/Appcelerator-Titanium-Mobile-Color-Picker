// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
Ti.include('color_picker.js');

// create base UI tab and root window
//
var win1 = createColorPicker({hexColor:"#621A84"});
win1.addEventListener("colorselect", function(e){
	Ti.API.log('info', e);
});
win1.addEventListener("selectcancel", function(e){
	Ti.API.log('info', "user cancelled selection");
});
// open tab group
win1.open();
