/* 
	vx.euclidranrythm by Charles Al. Picasso
	- Euclidean rythm using Bjorklund or standard algorithm

	contains:
	VxBjorlund class - bjorklund algorithm implementation as defined in Godfried Toussaint paper
	VxEuclidean class - main class that supports another very simple algorithm
*/

//================================================================//
// VxBjorklund algorithm class
//================================================================//

/* 
k - numbers of 1 in the binary sequence
N - length of the binary sequence
R - rotation to apply
*/

function VxBjorklund(k, N)
{
	this.k = k || 4;
	this.N = N || 16;
}

VxBjorklund.prototype.generate = function(K, N) 
{
	this.k = K || this.k;
	this.N = N || this.N;

	this.init();

	do {
		this.nextState();
	}  while (this.hasRemainder());

	return this.flattenState();
}

VxBjorklund.prototype.flattenState = function ()
{
	var accum = '';
	var state = this.state[0];
	for (var i = 0; i < state.length; ++i) {
		accum = accum + state[i];
	}
	return accum;
}

VxBjorklund.prototype.hasRemainder = function()
{
	return (this.state[0].length - this.state[1]) > 1;
}

VxBjorklund.prototype.init  = function()
{
	var array = [];
	for (var i = 0; i < this.N; ++i)
		array.push((i < this.k ? "1" : "0"));
	this.state = [array, this.k];
}

VxBjorklund.prototype.nextState  = function()
{
	var seq = this.state[0];
	var k = this.state[1];

	var slice = seq.slice(k);
	var slice_size = slice.length;
	var size = (slice_size > k) ? slice_size : k;

	var newseq = new Array(size);
	for (var i = 0; i < size; ++i)
	{
		newseq[i] = (i < k && i < slice_size) ? seq[i]+slice[i] : seq[i]; 
	}

	var newk = Math.min(slice_size, k);

	this.state = [newseq, newk];
}

/*
	VxEuclideanRythm

	k - numbers of pulses (1 in the binary sequence)
	N - length of the binary sequence (number of steps)
	R - rotation to apply (the rotation to apply)

	integermode = if value is set to 'inc' then will replace each 'pulse' by their respective pulse index position.
	ex: 100100100 -> 100200300.

	algorithm = if value is set to 'bjorklund' then will use the bjorklund algorithm, otherwise a faster algo (but wich may have outputs that may be a rotated version of the bjorklund)
*/

function VxEuclideanRythm ()
{
	this.k = 4;
	this.N = 16;
	this.R = 0;
	this.algorithm = 'bjorklund';
	this.integermode = 0;
}


VxEuclideanRythm.prototype.euclid = function (m, k)
{
	if (k == 0) return m;
	return euclid (k, m % k);
}

VxEuclideanRythm.prototype.generate = function  ()
{
	this.k = Math.max(0, this.k);
	this.N = Math.max(1, this.N);

	if (this.k == this.N)
	{
		//post('k == N\n');
		if (this.k > 0) {
			var seq = '';
			for (var i = 0; i < this.N; i++) {
				seq += '1';
			};
			this.sequence = seq;
		}
	}
	else 
	{
		if (this.algorithm == 'bjorklund')
		{
			//post('use bjorklund algorithm\n');
			this.bjorklund (this.k, this.N);
		}
		else 
		{
			//post('use fast algorithm\n');
			var result = new Array(this.N);

			var div = this.N / this.k;

			for (var i = 0; i < this.N; ++i)
				result[i] = 0;
			
			for (var i = 0; i < this.k; ++i)
				result[ Math.round(i * div) ] = 1;

			this.sequence = result.join('');
		}
		
		return (this.sequence = this.rotate(this.sequence, this.R));
	}
}

VxEuclideanRythm.prototype.bjorklund = function  (K, N)
{
	this.k = K || this.k;
	this.N = N || this.N;

	return (this.sequence = new VxBjorklund().generate(this.k, this.N));
}

VxEuclideanRythm.prototype.rotate  = function (data, rotation) {
	if (rotation == 0)
		return data;

	rotation = rotation % data.length;

	var result = new Array(data.length);

	for (var idx = 0; idx < data.length; ++idx) 
	{
		var nidx = 
		(rotation > idx)?(data.length-(rotation-idx)):(idx-rotation);

		result[idx] = data [nidx % data.length];
	};

	return result;
}

VxEuclideanRythm.prototype.isPulse = function  (index)
{ return this.sequence[index] == '1'; }

VxEuclideanRythm.prototype.isOff  = function (index)
{ return this.sequence[index] == '0'; }

VxEuclideanRythm.prototype.toIntegers = function () 
{
	var arr = [];
	var value = 1;
	var increment_index = this.integermode == 'inc';	
	var iszero;
	for (var i = 0; i < this.sequence.length; ++i) {
		iszero = (this.sequence[i] == '0');
		arr.push( iszero ? 0 : value);
		if (increment_index && !iszero) ++value;
	}
	
	return arr;
}


//================================================================//
// Main program
//================================================================//

var euclid = new VxEuclideanRythm();

if (jsarguments.length>1)
{
	var maxcount = jsarguments.length;

	for (var i = 0; i < maxcount; ++i)
	{
		if ((i+1) >= maxcount)
			break;

		if (jsarguments[i] == 'integermode') 
		{
			setintegermode(jsarguments[i+1]);
		} 
		else if (jsarguments[i] == 'algorithm') 
		{
			setalgorithm(jsarguments[i+1])
		}
	}
}

euclid.generate();
var last_sequence = euclid.toIntegers();

function setintegermode(type)
{
	euclid.integermode = (type == 'inc' || type > 0) ? 'inc' : 'default';
	post ("vx.euclideanrythm.js: set integermode to: "+euclid.integermode+'\n');
}

function setalgorithm(type)
{
	
	euclid.algorithm = (type > 0 || type == 'bjorklund') ? 'bjorklund' : 'default';
	post ("vx.euclideanrythm.js: set algorithm to: "+euclid.algorithm+'\n');
}

function getalgorithm()
{
	outlet(0, ['algorithm', euclid.algorithm]);
}

function pr_test_case_bjorklund(idx, obj, numPulses, numSteps, rotation, result)
{
	obj.k = numPulses;
	obj.N = numSteps;
	obj.R = rotation;
	obj.algorithm = 'bjorklund';
	
	var ok = obj.generate() == result;
	
	var msg = "["+idx+"] Test ("+numPulses+","+numSteps+") = '"+result+"' => ";
	if (ok)
	{
		post(msg + " OK\n");
	}
	else
	{
		error(msg +" (ERROR) != "+obj.sequence+'\n');
	}
}

function runtests()
{
	pr_test_index = 0;
	var obj = new VxEuclideanRythm();
	
	pr_test_case_bjorklund( 1, obj, 3, 8, 0, "10010010"); // cuban tresillo
	pr_test_case_bjorklund( 2, obj, 5, 8, 0, "10110110"); // cuban cinquillo
	pr_test_case_bjorklund( 3, obj, 2, 5, 0, "10100"); // Persian
	pr_test_case_bjorklund( 4, obj, 3, 4, 0, "1011"); // Calypso...
	pr_test_case_bjorklund( 5, obj, 3, 5, 0, "10101"); // Persian 2
	pr_test_case_bjorklund( 6, obj, 3, 7, 0, "1010100"); // Ruchenitza | Money Pink Flo
	pr_test_case_bjorklund( 7, obj, 3, 8, 0, "10010010"); // 
	pr_test_case_bjorklund( 8, obj, 4, 7, 0, "1010101"); // 
	pr_test_case_bjorklund( 9, obj, 4, 9, 0, "101010100"); // 
	pr_test_case_bjorklund(10, obj, 4,11, 0, "10010010010"); // 
	pr_test_case_bjorklund(11, obj, 5, 6, 0, "101111"); //
	pr_test_case_bjorklund(12, obj, 5, 11, 0, "10101010100"); //
	pr_test_case_bjorklund(13, obj, 5, 12, 0, "100101001010"); //
	pr_test_case_bjorklund(14, obj, 5, 16, 0, "1001001001001000"); //
	pr_test_case_bjorklund(15, obj, 7, 12, 0, "101101011010"); //
	pr_test_case_bjorklund(16, obj, 7, 16, 0, "1001010100101010"); //
	pr_test_case_bjorklund(17, obj, 9, 16, 0, "1011010101101010"); //
	pr_test_case_bjorklund(18, obj, 11, 24, 0, "100101010101001010101010"); //
	pr_test_case_bjorklund(19, obj, 13, 24, 0, "101101010101011010101010"); //
}

function list()
{
	var a = arrayfromargs(arguments);
	
	var k = a[0];
	var N = a[1];
	
	if (k === undefined || N === undefined)
	{
		post('incorrect number of arguments. 2 required');
		return;
	}
		
	var rotation = a[2];

	if (k < 0) k = 0;
	if (N == 0) N = 1;

	if (k > N) k = N;
	if (N < k) N = k;
		
	//post(k, N, rotation, "\n");
	
	euclid.k = k;
	euclid.N = N;
	
	if (rotation !== undefined) 
		euclid.R = rotation;

	euclid.generate();
	last_sequence = euclid.toIntegers();
	
	bang();
}

function bang()
{
	outlet(0, last_sequence);
}
