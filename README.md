# TinyEuclid

(Very) Minimal euclidean sequencer for Max and Max4Live.
***
![ScreenShot](screenshot.jpeg)
***


## Usage
* **Pulses** (knob) : number of pulses in the sequence.
* **Steps** (knob): number of steps in the sequence.
* **Rotation** (knob) : how much do we rotate the list.
* **Division** (menu) : set the note division for one step.
* **Rythm presets** (led menu) : list of different rythm described by Godfried Toussaint in his papers.
* **Presets** (store|recall on the right) : blue arrows will store at the corresponding index. the orange indexed buttons recall the preset. Up to 4 presets can be stored (for now). "Clear" will erase all presets. the leds on the right indicate if a preset is stored at this location.
* **A | B** (tab): 
	1. **B** uses bjorklund algorithm (to remain consistent with the notation)
	2. **A** uses a basic algorithm (wich produces a rotated version of the bjorklund)
<pre><code>this.k = numPulses;
this.N = numSteps;
var result = Array(this.N).fill(0);
const div = this.N / this.k;
for (var i = 0; i < this.k; ++i) result[ Math.round(i * div) ] = 1;
</code></pre>

## description

TinyEuclid is not intended to provide a robust device, it was first a prototype aimed at demonstrating the use of the [vx.ui.circularstep](https://github.com/calpika/vx-ui-circularstep) view.

Based on [The Euclidean Algorithm Generates Traditional Musical Rhythms](http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf) by Godfried Toussaint (his quoted rythmic examples are available as presets in a menu).

## Files

`TinyEuclid.amxd` : the final amxd file

The `/code` folder contains :<br/>
1. `vx.euclideanrythm.js`: javascript implementation of the bjorklund algorithm (mainly to remain consistent with the rythms described by Godfried Toussaint and their notations) and another (faster | simpler) which produces a rotated version of the bjorklund. Other options are also available.<br/>
2. `test_euclideanrythm.maxpat` : test patcher for the vx.euclideanrythm.js

The project has also a dependency to the [vx.ui.circularstep](https://github.com/calpika/vx-ui-circularstep) for its main *euclidean* view.

## Installation and basic usage
1. Download the `TinyEuclid.amxd` file.<br/>
2. (optional) Drop it to your ableton live user config folder to make it accessible.<br/>
3. Create a Live project or open an existing one.<br/>
4. Drag and drop the device in a MIDI track.<br/>
5. Drop an instrument after the device in order to ear a sound
6. (Tweek pitch, velocity, in the live.step view) press Play = the device should send the data to the instrument.

## Warning
This device is not production ready, with for sure some bugs... drop a line if you find annoying ones or have suggestions ! 



