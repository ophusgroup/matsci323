// znps3-phonons.js
// AnyWidget: Gamma-point phonon modes of ZnPS3 (C2/m), computed with MACE-MP-0 and
// phonopy by scripts/phonons/znps3_phonons.py, which also writes the data block
// below. The atoms of a 2x2x2 block of conventional cells oscillate along the
// eigenvector of the chosen mode, x(t) = x0 + A u sin(2 pi t / T), with the
// period T slowed to seconds and the amplitude A exaggerated. Drag to rotate.
// ZnS6 octahedra (blue) and the S6 octahedra around each P2 dimer (gold) can be
// drawn as translucent polyhedra. Self-contained canvas renderer, no libraries.
//
//   :::{anywidget} ../widgets/znps3-phonons.js
//   :::

// BEGIN DATA
const DATA = {"cell":[[6.0108,0.0,0.0],[0.0,10.4102,0.0],[-1.9856,0.0,7.2247]],"symbols":["Zn","Zn","Zn","Zn","P","P","P","P","S","S","S","S","S","S","S","S","S","S","S","S"],"positions":[[-0.0,3.4717,-0.0],[0.0,6.9386,-0.0],[3.0054,8.6768,0.0],[3.0054,1.7335,-0.0],[-0.0009,-0.0,1.1036],[6.0116,0.0,-1.1036],[3.0045,5.2051,1.1036],[3.0063,5.2051,-1.1036],[0.9873,1.711,1.6126],[5.0235,8.6992,-1.6126],[5.0235,1.711,-1.6126],[0.9873,8.6992,1.6126],[3.9927,6.9161,1.6126],[2.0181,3.4941,-1.6126],[2.0181,6.9161,-1.6126],[3.9927,3.4941,1.6126],[1.0281,5.2051,1.6138],[4.9826,5.2051,-1.6138],[4.0335,-0.0,1.6138],[1.9773,-0.0,-1.6138]],"modes":[{"thz":-0.5444,"cm":-18.16,"irrep":"Bg","disp":[[0.0032,-0.0,1.0],[-0.0032,-0.0,-1.0],[0.0032,-0.0,1.0],[-0.0032,-0.0,-1.0],[-0.0,0.0003,0.0],[-0.0,-0.0003,0.0],[-0.0,0.0003,0.0],[-0.0,-0.0003,0.0],[0.2595,-0.1502,0.004],[-0.2595,0.1502,-0.004],[0.2595,0.1502,0.004],[-0.2595,-0.1502,-0.004],[0.2595,-0.1502,0.004],[-0.2595,0.1502,-0.004],[0.2595,0.1502,0.004],[-0.2595,-0.1502,-0.004],[-0.0,0.2975,0.0],[-0.0,-0.2975,0.0],[-0.0,0.2975,0.0],[-0.0,-0.2975,0.0]]},{"thz":1.5656,"cm":52.22,"irrep":"Bg","disp":[[0.4749,-0.0,-0.0029],[-0.4749,0.0,0.0029],[0.4749,-0.0,-0.0029],[-0.4749,0.0,0.0029],[-0.0,-0.6506,-0.0],[0.0,0.6506,0.0],[-0.0,-0.6506,-0.0],[0.0,0.6506,0.0],[0.0535,-0.8939,0.5304],[-0.0535,0.8939,-0.5304],[0.0535,0.8939,0.5304],[-0.0535,-0.8939,-0.5304],[0.0535,-0.8939,0.5304],[-0.0535,0.8939,-0.5304],[0.0535,0.8939,0.5304],[-0.0535,-0.8939,-0.5304],[-0.0,-1.0,-0.0],[0.0,1.0,0.0],[-0.0,-1.0,-0.0],[0.0,1.0,0.0]]},{"thz":1.5693,"cm":52.35,"irrep":"Ag","disp":[[-0.0,-0.4895,0.0],[0.0,0.4895,-0.0],[-0.0,-0.4895,0.0],[0.0,0.4895,-0.0],[-0.676,0.0,-0.0045],[0.676,-0.0,0.0045],[-0.676,0.0,-0.0045],[0.676,-0.0,0.0045],[-1.0,0.0565,0.3208],[1.0,-0.0565,-0.3208],[1.0,0.0565,-0.3208],[-1.0,-0.0565,0.3208],[-1.0,0.0565,0.3208],[1.0,-0.0565,-0.3208],[1.0,0.0565,-0.3208],[-1.0,-0.0565,0.3208],[-0.8998,0.0,-0.6478],[0.8998,-0.0,0.6478],[-0.8998,0.0,-0.6478],[0.8998,-0.0,0.6478]]},{"thz":1.8896,"cm":63.03,"irrep":"Bu","disp":[[1.0,-0.0,-0.0146],[1.0,-0.0,-0.0146],[1.0,-0.0,-0.0146],[1.0,-0.0,-0.0146],[-0.3635,0.0,0.024],[-0.3635,0.0,0.024],[-0.3635,0.0,0.024],[-0.3635,0.0,0.024],[-0.4488,-0.1874,0.3244],[-0.4488,-0.1874,0.3244],[-0.4488,0.1874,0.3244],[-0.4488,0.1874,0.3244],[-0.4488,-0.1874,0.3244],[-0.4488,-0.1874,0.3244],[-0.4488,0.1874,0.3244],[-0.4488,0.1874,0.3244],[-0.7904,0.0,-0.6421],[-0.7904,0.0,-0.6421],[-0.7904,0.0,-0.6421],[-0.7904,0.0,-0.6421]]},{"thz":1.8926,"cm":63.13,"irrep":"Au","disp":[[0.0,1.0,-0.0],[0.0,1.0,-0.0],[0.0,1.0,-0.0],[0.0,1.0,-0.0],[-0.0,-0.3674,0.0],[-0.0,-0.3674,0.0],[-0.0,-0.3674,0.0],[-0.0,-0.3674,0.0],[-0.1879,-0.6679,0.5353],[-0.1879,-0.6679,0.5353],[0.1879,-0.6679,-0.5353],[0.1879,-0.6679,-0.5353],[-0.1879,-0.6679,0.5353],[-0.1879,-0.6679,0.5353],[0.1879,-0.6679,-0.5353],[0.1879,-0.6679,-0.5353],[-0.0,-0.3482,-0.0],[-0.0,-0.3482,-0.0],[-0.0,-0.3482,-0.0],[-0.0,-0.3482,-0.0]]},{"thz":2.4266,"cm":80.94,"irrep":"Ag","disp":[[-0.0,1.0,0.0],[0.0,-1.0,0.0],[-0.0,1.0,0.0],[0.0,-1.0,0.0],[-0.1865,-0.0,-0.0015],[0.1865,0.0,0.0015],[-0.1865,-0.0,-0.0015],[0.1865,0.0,0.0015],[-0.3157,0.0031,-0.0169],[0.3157,-0.0031,0.0169],[0.3157,0.0031,0.0169],[-0.3157,-0.0031,-0.0169],[-0.3157,0.0031,-0.0169],[0.3157,-0.0031,0.0169],[0.3157,0.0031,0.0169],[-0.3157,-0.0031,-0.0169],[-0.308,-0.0,0.0335],[0.308,0.0,-0.0335],[-0.308,-0.0,0.0335],[0.308,0.0,-0.0335]]},{"thz":2.4317,"cm":81.11,"irrep":"Bg","disp":[[-1.0,-0.0,0.0022],[1.0,0.0,-0.0022],[-1.0,-0.0,0.0022],[1.0,0.0,-0.0022],[0.0,-0.1877,0.0],[-0.0,0.1877,0.0],[0.0,-0.1877,0.0],[-0.0,0.1877,0.0],[0.0068,-0.3138,-0.0306],[-0.0068,0.3138,0.0306],[0.0068,0.3138,-0.0306],[-0.0068,-0.3138,0.0306],[0.0068,-0.3138,-0.0306],[-0.0068,0.3138,0.0306],[0.0068,0.3138,-0.0306],[-0.0068,-0.3138,0.0306],[0.0,-0.321,-0.0],[-0.0,0.321,0.0],[0.0,-0.321,-0.0],[-0.0,0.321,0.0]]},{"thz":2.5051,"cm":83.56,"irrep":"Bu","disp":[[0.0334,-0.0,0.9325],[0.0334,0.0,0.9325],[0.0334,-0.0,0.9325],[0.0334,0.0,0.9325],[-0.0247,0.0,-1.0],[-0.0247,0.0,-1.0],[-0.0247,0.0,-1.0],[-0.0247,0.0,-1.0],[-0.0829,-0.1081,-0.3338],[-0.0829,-0.1081,-0.3338],[-0.0829,0.1081,-0.3338],[-0.0829,0.1081,-0.3338],[-0.0829,-0.1081,-0.3338],[-0.0829,-0.1081,-0.3338],[-0.0829,0.1081,-0.3338],[-0.0829,0.1081,-0.3338],[0.1216,0.0,-0.2678],[0.1216,0.0,-0.2678],[0.1216,0.0,-0.2678],[0.1216,0.0,-0.2678]]},{"thz":3.0372,"cm":101.31,"irrep":"Bu","disp":[[0.3591,-0.0,-0.0344],[0.3591,-0.0,-0.0344],[0.3591,-0.0,-0.0344],[0.3591,-0.0,-0.0344],[-0.3525,0.0,0.029],[-0.3525,0.0,0.029],[-0.3525,0.0,0.029],[-0.3525,0.0,0.029],[-0.2241,0.1638,-0.4789],[-0.2241,0.1638,-0.4789],[-0.2241,-0.1638,-0.4789],[-0.2241,-0.1638,-0.4789],[-0.2241,0.1638,-0.4789],[-0.2241,0.1638,-0.4789],[-0.2241,-0.1638,-0.4789],[-0.2241,-0.1638,-0.4789],[0.0564,0.0,1.0],[0.0564,0.0,1.0],[0.0564,0.0,1.0],[0.0564,0.0,1.0]]},{"thz":3.0579,"cm":102.0,"irrep":"Au","disp":[[-0.0,-0.405,-0.0],[-0.0,-0.405,-0.0],[-0.0,-0.405,-0.0],[-0.0,-0.405,-0.0],[0.0,0.4041,0.0],[0.0,0.4041,0.0],[0.0,0.4041,0.0],[0.0,0.4041,0.0],[-0.1909,0.0335,1.0],[-0.1909,0.0335,1.0],[0.1909,0.0335,-1.0],[0.1909,0.0335,-1.0],[-0.1909,0.0335,1.0],[-0.1909,0.0335,1.0],[0.1909,0.0335,-1.0],[0.1909,0.0335,-1.0],[-0.0,0.3684,-0.0],[-0.0,0.3684,-0.0],[-0.0,0.3684,-0.0],[-0.0,0.3684,-0.0]]},{"thz":4.0968,"cm":136.65,"irrep":"Ag","disp":[[0.0,0.1466,-0.0],[-0.0,-0.1466,0.0],[0.0,0.1466,-0.0],[-0.0,-0.1466,0.0],[0.5343,-0.0,-0.0041],[-0.5343,0.0,0.0041],[0.5343,-0.0,-0.0041],[-0.5343,0.0,0.0041],[0.1498,0.022,0.4904],[-0.1498,-0.022,-0.4904],[-0.1498,0.022,-0.4904],[0.1498,-0.022,0.4904],[0.1498,0.022,0.4904],[-0.1498,-0.022,-0.4904],[-0.1498,0.022,-0.4904],[0.1498,-0.022,0.4904],[0.1892,0.0,-1.0],[-0.1892,0.0,1.0],[0.1892,0.0,-1.0],[-0.1892,0.0,1.0]]},{"thz":4.1108,"cm":137.12,"irrep":"Bg","disp":[[-0.1704,0.0,-0.002],[0.1704,-0.0,0.002],[-0.1704,0.0,-0.002],[0.1704,-0.0,0.002],[0.0,0.6165,-0.0],[-0.0,-0.6165,-0.0],[0.0,0.6165,-0.0],[-0.0,-0.6165,-0.0],[0.0244,0.2013,1.0],[-0.0244,-0.2013,-1.0],[0.0244,-0.2013,1.0],[-0.0244,0.2013,-1.0],[0.0244,0.2013,1.0],[-0.0244,-0.2013,-1.0],[0.0244,-0.2013,1.0],[-0.0244,0.2013,-1.0],[0.0,0.1512,-0.0],[-0.0,-0.1512,0.0],[0.0,0.1512,-0.0],[-0.0,-0.1512,0.0]]},{"thz":4.5205,"cm":150.78,"irrep":"Bg","disp":[[-0.0018,0.0,0.4386],[0.0018,0.0,-0.4386],[-0.0018,0.0,0.4386],[0.0018,0.0,-0.4386],[0.0,0.0036,-0.0],[-0.0,-0.0036,-0.0],[0.0,0.0036,-0.0],[-0.0,-0.0036,-0.0],[-0.8595,0.5014,-0.0048],[0.8595,-0.5014,0.0048],[-0.8595,-0.5014,-0.0048],[0.8595,0.5014,0.0048],[-0.8595,0.5014,-0.0048],[0.8595,-0.5014,0.0048],[-0.8595,-0.5014,-0.0048],[0.8595,0.5014,0.0048],[0.0,-1.0,-0.0],[-0.0,1.0,0.0],[0.0,-1.0,-0.0],[-0.0,1.0,0.0]]},{"thz":4.5494,"cm":151.75,"irrep":"Au","disp":[[-0.0,0.002,-0.0],[0.0,0.002,0.0],[-0.0,0.002,-0.0],[0.0,0.002,0.0],[0.0,-0.0008,0.0],[-0.0,-0.0008,-0.0],[0.0,-0.0008,0.0],[-0.0,-0.0008,-0.0],[0.8647,-0.5017,-0.0013],[0.8647,-0.5017,-0.0013],[-0.8647,-0.5017,0.0013],[-0.8647,-0.5017,0.0013],[0.8647,-0.5017,-0.0013],[0.8647,-0.5017,-0.0013],[-0.8647,-0.5017,0.0013],[-0.8647,-0.5017,0.0013],[0.0,1.0,0.0],[-0.0,1.0,-0.0],[0.0,1.0,0.0],[-0.0,1.0,-0.0]]},{"thz":5.2559,"cm":175.32,"irrep":"Bu","disp":[[-0.078,0.0,0.0024],[-0.078,0.0,0.0024],[-0.078,0.0,0.0024],[-0.078,0.0,0.0024],[-0.8744,0.0,0.0137],[-0.8744,0.0,0.0137],[-0.8744,0.0,0.0137],[-0.8744,0.0,0.0137],[0.917,-1.0,-0.1902],[0.917,-1.0,-0.1902],[0.917,1.0,-0.1902],[0.917,1.0,-0.1902],[0.917,-1.0,-0.1902],[0.917,-1.0,-0.1902],[0.917,1.0,-0.1902],[0.917,1.0,-0.1902],[-0.8304,-0.0,0.3624],[-0.8304,-0.0,0.3624],[-0.8304,-0.0,0.3624],[-0.8304,-0.0,0.3624]]},{"thz":5.2645,"cm":175.6,"irrep":"Au","disp":[[-0.0,-0.051,-0.0],[-0.0,-0.051,-0.0],[-0.0,-0.051,-0.0],[-0.0,-0.051,-0.0],[-0.0,-0.5868,0.0],[-0.0,-0.5868,-0.0],[-0.0,-0.5868,0.0],[-0.0,-0.5868,-0.0],[-0.6742,-0.1645,-0.2139],[-0.6742,-0.1645,-0.2139],[0.6742,-0.1645,0.2139],[0.6742,-0.1645,0.2139],[-0.6742,-0.1645,-0.2139],[-0.6742,-0.1645,-0.2139],[0.6742,-0.1645,0.2139],[0.6742,-0.1645,0.2139],[-0.0,1.0,0.0],[-0.0,1.0,0.0],[-0.0,1.0,0.0],[-0.0,1.0,0.0]]},{"thz":5.4155,"cm":180.64,"irrep":"Bg","disp":[[0.0215,0.0,-0.0022],[-0.0215,-0.0,0.0022],[0.0215,0.0,-0.0022],[-0.0215,-0.0,0.0022],[0.0,0.59,-0.0],[0.0,-0.59,-0.0],[0.0,0.59,-0.0],[0.0,-0.59,-0.0],[0.7604,0.3046,-0.1762],[-0.7604,-0.3046,0.1762],[0.7604,-0.3046,-0.1762],[-0.7604,0.3046,0.1762],[0.7604,0.3046,-0.1762],[-0.7604,-0.3046,0.1762],[0.7604,-0.3046,-0.1762],[-0.7604,0.3046,0.1762],[0.0,-1.0,-0.0],[0.0,1.0,0.0],[0.0,-1.0,-0.0],[0.0,1.0,0.0]]},{"thz":5.4249,"cm":180.95,"irrep":"Ag","disp":[[-0.0,-0.0265,-0.0],[-0.0,0.0265,-0.0],[-0.0,-0.0265,-0.0],[-0.0,0.0265,-0.0],[0.7778,0.0,0.0053],[-0.7778,0.0,-0.0053],[0.7778,0.0,0.0053],[-0.7778,0.0,-0.0053],[-0.7529,1.0,-0.1254],[0.7529,-1.0,0.1254],[0.7529,1.0,0.1254],[-0.7529,-1.0,-0.1254],[-0.7529,1.0,-0.1254],[0.7529,-1.0,0.1254],[0.7529,1.0,0.1254],[-0.7529,-1.0,-0.1254],[0.9773,-0.0,0.2739],[-0.9773,-0.0,-0.2739],[0.9773,-0.0,0.2739],[-0.9773,-0.0,-0.2739]]},{"thz":5.6636,"cm":188.92,"irrep":"Bu","disp":[[-0.0009,-0.0,0.3382],[-0.0009,-0.0,0.3382],[-0.0009,-0.0,0.3382],[-0.0009,-0.0,0.3382],[0.0007,0.0,1.0],[0.0007,-0.0,1.0],[0.0007,0.0,1.0],[0.0007,-0.0,1.0],[0.2426,0.438,-0.5561],[0.2426,0.438,-0.5561],[0.2426,-0.438,-0.5561],[0.2426,-0.438,-0.5561],[0.2426,0.438,-0.5561],[0.2426,0.438,-0.5561],[0.2426,-0.438,-0.5561],[0.2426,-0.438,-0.5561],[-0.4842,-0.0,-0.5435],[-0.4842,0.0,-0.5435],[-0.4842,-0.0,-0.5435],[-0.4842,0.0,-0.5435]]},{"thz":5.7014,"cm":190.18,"irrep":"Ag","disp":[[0.0,0.001,-0.0],[0.0,-0.001,-0.0],[0.0,0.001,-0.0],[0.0,-0.001,-0.0],[-0.0009,0.0,0.2073],[0.0009,0.0,-0.2073],[-0.0009,0.0,0.2073],[0.0009,0.0,-0.2073],[-0.1185,-0.2164,1.0],[0.1185,0.2164,-1.0],[0.1185,-0.2164,-1.0],[-0.1185,0.2164,1.0],[-0.1185,-0.2164,1.0],[0.1185,0.2164,-1.0],[0.1185,-0.2164,-1.0],[-0.1185,0.2164,1.0],[0.2417,-0.0,0.9806],[-0.2417,-0.0,-0.9806],[0.2417,-0.0,0.9806],[-0.2417,-0.0,-0.9806]]},{"thz":8.7198,"cm":290.86,"irrep":"Ag","disp":[[0.0,0.0005,-0.0],[0.0,-0.0005,0.0],[0.0,0.0005,-0.0],[0.0,-0.0005,0.0],[0.0069,-0.0,1.0],[-0.0069,-0.0,-1.0],[0.0069,-0.0,1.0],[-0.0069,-0.0,-1.0],[0.2357,0.4073,0.0509],[-0.2357,-0.4073,-0.0509],[-0.2357,0.4073,-0.0509],[0.2357,-0.4073,0.0509],[0.2357,0.4073,0.0509],[-0.2357,-0.4073,-0.0509],[-0.2357,0.4073,-0.0509],[0.2357,-0.4073,0.0509],[-0.481,-0.0,0.0473],[0.481,-0.0,-0.0473],[-0.481,-0.0,0.0473],[0.481,-0.0,-0.0473]]},{"thz":11.4157,"cm":380.78,"irrep":"Bu","disp":[[-0.0002,0.0,0.0801],[-0.0002,0.0,0.0801],[-0.0002,0.0,0.0801],[-0.0002,0.0,0.0801],[0.0056,-0.0,0.8965],[0.0056,0.0,0.8965],[0.0056,-0.0,0.8965],[0.0056,0.0,0.8965],[-0.5025,-0.8691,-0.3432],[-0.5025,-0.8691,-0.3432],[-0.5025,0.8691,-0.3432],[-0.5025,0.8691,-0.3432],[-0.5025,-0.8691,-0.3432],[-0.5025,-0.8691,-0.3432],[-0.5025,0.8691,-0.3432],[-0.5025,0.8691,-0.3432],[1.0,0.0,-0.3431],[1.0,-0.0,-0.3431],[1.0,0.0,-0.3431],[1.0,-0.0,-0.3431]]},{"thz":12.5258,"cm":417.81,"irrep":"Ag","disp":[[-0.0,-0.001,0.0],[0.0,0.001,-0.0],[-0.0,-0.001,0.0],[0.0,0.001,-0.0],[0.0115,0.0,1.0],[-0.0115,0.0,-1.0],[0.0115,0.0,1.0],[-0.0115,0.0,-1.0],[-0.3301,-0.5701,-0.2303],[0.3301,0.5701,0.2303],[0.3301,-0.5701,0.2303],[-0.3301,0.5701,-0.2303],[-0.3301,-0.5701,-0.2303],[0.3301,0.5701,0.2303],[0.3301,-0.5701,0.2303],[-0.3301,0.5701,-0.2303],[0.6483,-0.0,-0.2256],[-0.6483,0.0,0.2256],[0.6483,-0.0,-0.2256],[-0.6483,0.0,0.2256]]},{"thz":13.0887,"cm":436.59,"irrep":"Bg","disp":[[-0.0539,0.0,-0.0002],[0.0539,-0.0,0.0002],[-0.0539,0.0,-0.0002],[0.0539,-0.0,0.0002],[0.0,-1.0,-0.0],[0.0,1.0,0.0],[0.0,-1.0,-0.0],[0.0,1.0,0.0],[0.25,0.4449,0.1919],[-0.25,-0.4449,-0.1919],[0.25,-0.4449,0.1919],[-0.25,0.4449,-0.1919],[0.25,0.4449,0.1919],[-0.25,-0.4449,-0.1919],[0.25,-0.4449,0.1919],[-0.25,0.4449,-0.1919],[-0.0,0.0112,0.0],[-0.0,-0.0112,0.0],[-0.0,0.0112,0.0],[-0.0,-0.0112,0.0]]},{"thz":13.0965,"cm":436.85,"irrep":"Ag","disp":[[-0.0,-0.0538,0.0],[0.0,0.0538,-0.0],[-0.0,-0.0538,0.0],[0.0,0.0538,-0.0],[1.0,-0.0,-0.0147],[-1.0,0.0,0.0147],[1.0,-0.0,-0.0147],[-1.0,0.0,0.0147],[-0.1552,-0.2494,-0.1088],[0.1552,0.2494,0.1088],[0.1552,-0.2494,0.1088],[-0.1552,0.2494,-0.1088],[-0.1552,-0.2494,-0.1088],[0.1552,0.2494,0.1088],[0.1552,-0.2494,0.1088],[-0.1552,0.2494,-0.1088],[-0.5912,-0.0,0.2241],[0.5912,-0.0,-0.2241],[-0.5912,-0.0,0.2241],[0.5912,-0.0,-0.2241]]},{"thz":13.3117,"cm":444.03,"irrep":"Au","disp":[[-0.0,-0.0357,0.0],[-0.0,-0.0357,0.0],[-0.0,-0.0357,0.0],[-0.0,-0.0357,0.0],[0.0,1.0,-0.0],[0.0,1.0,0.0],[0.0,1.0,-0.0],[0.0,1.0,0.0],[-0.2458,-0.439,-0.2394],[-0.2458,-0.439,-0.2394],[0.2458,-0.439,0.2394],[0.2458,-0.439,0.2394],[-0.2458,-0.439,-0.2394],[-0.2458,-0.439,-0.2394],[0.2458,-0.439,0.2394],[0.2458,-0.439,0.2394],[-0.0,-0.0151,0.0],[-0.0,-0.0151,0.0],[-0.0,-0.0151,0.0],[-0.0,-0.0151,0.0]]},{"thz":13.3158,"cm":444.16,"irrep":"Bu","disp":[[-0.0356,0.0,0.0003],[-0.0356,0.0,0.0003],[-0.0356,0.0,0.0003],[-0.0356,0.0,0.0003],[1.0,0.0,0.0002],[1.0,-0.0,0.0002],[1.0,0.0,0.0002],[1.0,-0.0,0.0002],[-0.1549,-0.2427,-0.1388],[-0.1549,-0.2427,-0.1388],[-0.1549,0.2427,-0.1388],[-0.1549,0.2427,-0.1388],[-0.1549,-0.2427,-0.1388],[-0.1549,-0.2427,-0.1388],[-0.1549,0.2427,-0.1388],[-0.1549,0.2427,-0.1388],[-0.5836,-0.0,0.2766],[-0.5836,0.0,0.2766],[-0.5836,-0.0,0.2766],[-0.5836,0.0,0.2766]]}]};
// END DATA

const COLORS = { Zn: [120, 140, 190], P: [230, 140, 40], S: [225, 200, 60] };
const RADII = { Zn: 0.62, P: 0.48, S: 0.55 };     // display radii, Angstrom
const CUT = { "Zn-S": 2.85, "P-S": 2.25, "P-P": 2.4 };

function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function scl(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function norm(a) { return Math.sqrt(dot(a, a)); }
function unit(a) { const n = norm(a); return scl(a, 1 / n); }
function frac2cart(cell, f) {
  return [f[0] * cell[0][0] + f[1] * cell[1][0] + f[2] * cell[2][0],
          f[0] * cell[0][1] + f[1] * cell[1][1] + f[2] * cell[2][1],
          f[0] * cell[0][2] + f[1] * cell[1][2] + f[2] * cell[2][2]];
}

// Build the displayed atoms, bonds, and polyhedra for an n0 x n1 x n2 block.
// Every atom keeps the index of its parent in the conventional cell, so a
// Gamma-point eigenvector applies to all periodic images unchanged.
function buildScene(data, n0, n1, n2, rcut = 1e9) {
  const cell = data.cell, sym = data.symbols, pos = data.positions;
  const atoms = [], key = new Map();
  function addAtom(i, t) {
    const k = i + ":" + t.join(",");
    if (key.has(k)) return key.get(k);
    const p = add(pos[i], frac2cart(cell, t));
    atoms.push({ base: i, el: sym[i], p0: p, t });
    key.set(k, atoms.length - 1);
    return atoms.length - 1;
  }
  for (let a = 0; a < n0; a++) for (let b = 0; b < n1; b++) for (let c = 0; c < n2; c++)
    for (let i = 0; i < sym.length; i++) addAtom(i, [a, b, c]);
  // neighbours of every base atom over the periodic images
  function neighbours(i, el, cut) {
    const out = [];
    for (let j = 0; j < sym.length; j++) {
      if (sym[j] !== el) continue;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
        const t = [a, b, c];
        const d = norm(sub(add(pos[j], frac2cart(cell, t)), pos[i]));
        if (d > 0.1 && d < cut) out.push({ j, t });
      }
    }
    return out;
  }
  const bonds = [], polys = [];
  const nBlock = atoms.length;
  for (let k = 0; k < nBlock; k++) {
    const A = atoms[k];
    const tA = A.t;
    if (A.el === "Zn") {
      const nb = neighbours(A.base, "S", CUT["Zn-S"]);
      const v = nb.map(o => addAtom(o.j, add(tA, o.t)));
      polys.push({ kind: "Zn", center: k, verts: v });
    }
    if (A.el === "P") {
      const nbS = neighbours(A.base, "S", CUT["P-S"]);
      for (const o of nbS) bonds.push([k, addAtom(o.j, add(tA, o.t))]);
      const nbP = neighbours(A.base, "P", CUT["P-P"]);
      for (const o of nbP) {
        const m = addAtom(o.j, add(tA, o.t));
        if (m > k || m >= nBlock) {
          bonds.push([k, m]);
          // S6 octahedron around the P2 dimer: the three S on each P
          const v = nbS.map(q => addAtom(q.j, add(tA, q.t)));
          const tB = add(tA, o.t);
          for (const q of neighbours(o.j, "S", CUT["P-S"])) v.push(addAtom(q.j, add(tB, q.t)));
          polys.push({ kind: "P2", center: k, partner: m, verts: v });
        }
      }
    }
  }
  // octahedron faces: triangles of vertices with no opposite (farthest) pair
  for (const P of polys) {
    const v = P.verts, n = v.length, opp = new Array(n).fill(-1);
    for (let i = 0; i < n; i++) {
      let best = -1, bd = -1;
      for (let j = 0; j < n; j++) {
        const d = norm(sub(atoms[v[i]].p0, atoms[v[j]].p0));
        if (d > bd) { bd = d; best = j; }
      }
      opp[i] = best;
    }
    P.faces = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++)
      if (opp[i] !== j && opp[i] !== k && opp[j] !== k) P.faces.push([v[i], v[j], v[k]]);
  }
  return cropFlake(atoms, bonds, polys, cell, rcut);
}

// Keep only the polyhedra whose centres lie within rcut (in the layer plane) of the
// middle of the block, with every vertex, so the edge of the picture is a round flake
// of complete ZnS6 and P2S6 units rather than a ragged cell boundary.
function cropFlake(atoms, bonds, polys, cell, rcut) {
  const nrm = unit(cross(cell[0], cell[1]));
  const ctr = P => P.kind === "Zn" ? atoms[P.center].p0
    : scl(add(atoms[P.center].p0, atoms[P.partner].p0), 0.5);
  let mid = [0, 0, 0], nz = 0;
  for (const A of atoms) if (A.el === "Zn") { mid = add(mid, A.p0); nz++; }
  mid = scl(mid, 1 / nz);
  const inPlane = v => { const d = sub(v, mid); return norm(sub(d, scl(nrm, dot(d, nrm)))); };
  const keepP = polys.filter(P => inPlane(ctr(P)) < rcut);
  const used = new Set();
  for (const P of keepP) {
    used.add(P.center); if (P.partner !== undefined) used.add(P.partner);
    for (const v of P.verts) used.add(v);
  }
  const map = new Map(), out = [];
  [...used].sort((a, b) => a - b).forEach(i => { map.set(i, out.length); out.push(atoms[i]); });
  const ob = bonds.filter(b => map.has(b[0]) && map.has(b[1])).map(b => [map.get(b[0]), map.get(b[1])]);
  const op = keepP.map(P => ({ kind: P.kind, center: map.get(P.center),
    faces: P.faces.map(f => f.map(i => map.get(i))) }));
  let c0 = [0, 0, 0];
  for (const A of out) c0 = add(c0, A.p0);
  c0 = scl(c0, 1 / out.length);
  return { atoms: out, bonds: ob, polys: op, center: c0 };
}

function render({ model, el }) {
  const uid = "zp" + Math.random().toString(36).slice(2, 8);
  const style = document.createElement("style");
  style.textContent = `
.${uid} { --w-panel:#fff; --w-fg:#1a1a1a; --w-muted:#777; --w-border:#d8d5d0;
  --w-accent:rgb(204,0,0); font-family:system-ui,sans-serif; color:var(--w-fg);
  display:block; margin-bottom:30px; font-size:13px; }
.${uid}.w-dark { --w-panel:#000; --w-fg:#eee; --w-muted:#9a9a9a; --w-border:#333;
  --w-accent:rgb(255,63,63); }
.${uid} .w-top { display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap; align-items:center; }
.${uid} button, .${uid} select { border:1px solid var(--w-border); border-radius:6px;
  background:var(--w-panel); color:var(--w-fg); padding:4px 10px; cursor:pointer; font-size:13px; }
.${uid} .w-lab { color:var(--w-muted); margin-left:6px; }
.${uid} button.on { border-color:var(--w-accent); color:var(--w-accent); font-weight:600; }
.${uid} canvas { background:var(--w-panel); border:1px solid var(--w-border);
  border-radius:10px; display:block; width:100%; height:min(480px, 92vw); cursor:grab;
  touch-action:none; user-select:none; -webkit-user-select:none; }
.${uid} .w-ctl { display:flex; gap:14px; flex-wrap:wrap; margin-top:8px; align-items:flex-end; }
.${uid} label { color:var(--w-muted); display:flex; flex-direction:column; gap:2px; flex:1 1 180px; }
.${uid} .w-chks { display:flex; gap:14px; flex-wrap:wrap; flex:1 1 100%; }
.${uid} label.w-chk { flex:0 0 auto; flex-direction:row; align-items:center; gap:4px; }
.${uid} .w-val { color:var(--w-fg); font-weight:600; }
.${uid} input[type=range] { width:100%; accent-color:var(--w-accent); }
.${uid} .w-info { margin-top:6px; color:var(--w-fg); }
.${uid} .w-cap { margin-top:6px; font-size:13.5px; color:var(--w-muted); }
`;
  const root = document.createElement("div");
  root.className = uid;
  root.innerHTML = `
<div class="w-top">
  <button class="w-play">Pause</button>
  <select class="w-mode"></select>
  <select class="w-layers"><option value="1">1 layer</option><option value="2">2 layers</option><option value="3">3 layers</option></select>
  <span class="w-lab">view</span>
  <button class="w-top-view">top</button>
  <button class="w-tilt-view">tilted</button>
  <button class="w-side-view">side</button>
</div>
<canvas></canvas>
<div class="w-ctl">
  <label>oscillation period on screen <span class="w-val w-spv"></span>
    <input class="w-sp" type="range" min="0.4" max="6" step="0.1" value="1.6"></label>
  <label>amplitude exaggeration, largest displacement <span class="w-val w-amv"></span>
    <input class="w-am" type="range" min="0" max="0.8" step="0.01" value="0.35"></label>
  <div class="w-chks">
    <label class="w-chk"><input class="w-mot" type="checkbox" checked> atom motion</label>
    <label class="w-chk"><input class="w-poly" type="checkbox" checked> polyhedra</label>
    <label class="w-chk"><input class="w-arr" type="checkbox"> arrows</label>
  </div>
</div>
<div class="w-info"></div>
<div class="w-cap"><b>Phonon modes of ZnPS3.</b> Gamma-point eigenvectors from MACE-MP-0, with ZnS<sub>6</sub> (blue) and P<sub>2</sub>S<sub>6</sub> (gold) octahedra. Drag to rotate; scroll or pinch to zoom, and twist two fingers to spin.</div>`;
  el.appendChild(style); el.appendChild(root);

  const cv = root.querySelector("canvas"), g = cv.getContext("2d");
  if (!DATA) { root.querySelector(".w-info").textContent = "No mode data."; return; }
  const RCUT = 9.5;
  let scene = buildScene(DATA, 5, 3, 1, RCUT);
  const modes = DATA.modes.filter(m => Math.abs(m.thz) > 0.05);
  const sel = root.querySelector(".w-mode");
  const act = m => (m.irrep === "Ag" || m.irrep === "Bg") ? "Raman" : (m.irrep === "Au" || m.irrep === "Bu") ? "IR" : "";
  modes.forEach((m, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = m.thz < 0
      ? `${(-m.thz).toFixed(2)}i THz, ${m.irrep}, unstable`
      : `${m.thz.toFixed(2)} THz (${m.cm.toFixed(0)} cm⁻¹), ${m.irrep}, ${act(m)}`;
    sel.appendChild(o);
  });
  function nearest(f, kind) {
    let best = 0, bd = 1e9;
    modes.forEach((m, i) => {
      if (kind && act(m) !== kind) return;
      const d = Math.abs(m.thz - f);
      if (m.thz > 0 && d < bd) { bd = d; best = i; }
    });
    return best;
  }
  let mi = modes.findIndex(m => m.irrep === "Ag" && Math.abs(m.thz - 5.42) < 0.05);   // default: the 5.42 THz Ag mode
  if (mi < 0) mi = nearest(5.42, "Raman");
  sel.value = mi;

  // kinetic-energy share of each element, for the info line
  const mass = { Zn: 65.38, P: 30.97, S: 32.06 };
  function share(m) {
    const s = { Zn: 0, P: 0, S: 0 };
    m.disp.forEach((u, i) => { s[DATA.symbols[i]] += mass[DATA.symbols[i]] * dot(u, u); });
    const t = s.Zn + s.P + s.S;
    return `Zn ${(100 * s.Zn / t).toFixed(0)}%, P ${(100 * s.P / t).toFixed(0)}%, S ${(100 * s.S / t).toFixed(0)}%`;
  }

  // view: rotation matrix R maps crystal Cartesian -> screen (x right, y up, z out)
  const cell = DATA.cell;
  const nrm = unit(cross(cell[0], cell[1]));          // layer normal
  function basisFor(zAxis, upHint) {
    const z = unit(zAxis);
    let x = cross(upHint, z);
    if (norm(x) < 1e-6) x = cross([1, 0, 0], z);
    x = unit(x);
    const y = cross(z, x);
    return [x, y, z];
  }
  let R = basisFor(nrm, unit(cell[1]));
  function rotate(R, ax, ang) {                       // rotate the view about screen axis ax
    const c = Math.cos(ang), s = Math.sin(ang);
    const [x, y, z] = R;
    if (ax === "y") return [add(scl(x, c), scl(z, -s)), y, add(scl(x, s), scl(z, c))];
    return [x, add(scl(y, c), scl(z, s)), add(scl(y, -s), scl(z, c))];
  }
  const tilted = () => rotate(rotate(basisFor(nrm, unit(cell[1])), "x", -0.95), "y", 0.25);
  R = basisFor(nrm, unit(cell[1]));                // default: top view, down the layer normal

  let playing = true, t0 = performance.now(), phase = 0, raf = 0;
  const btnPlay = root.querySelector(".w-play");
  const inSp = root.querySelector(".w-sp"), inAm = root.querySelector(".w-am");
  const chkPoly = root.querySelector(".w-poly"), chkArr = root.querySelector(".w-arr");
  const chkMot = root.querySelector(".w-mot");
  function dark() { return document.documentElement.classList.contains("dark"); }

  const BG = { light: [255, 255, 255], dark: [0, 0, 0] };
  function mix(c, bg, f) { return c.map((v, k) => Math.round(v * (1 - f) + bg[k] * f)); }
  function draw() {
    const W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const isD = dark(), bg = isD ? BG.dark : BG.light;
    g.fillStyle = `rgb(${bg})`; g.fillRect(0, 0, W, H);
    const m = modes[mi], A = +inAm.value, s = Math.sin(phase);
    const sMove = chkMot.checked ? s : 0;              // atoms held still when motion is off
    const pts = scene.atoms.map(a => {
      const u = m.disp[a.base];
      const p = sub(add(a.p0, scl(u, A * sMove)), scene.center);
      return [dot(p, R[0]), dot(p, R[1]), dot(p, R[2])];
    });
    let ex = 1, ey = 1, zmin = 1e9, zmax = -1e9;
    for (const a of scene.atoms) {
      const p = sub(a.p0, scene.center);
      ex = Math.max(ex, Math.abs(dot(p, R[0]))); ey = Math.max(ey, Math.abs(dot(p, R[1])));
      const z = dot(p, R[2]); zmin = Math.min(zmin, z); zmax = Math.max(zmax, z);
    }
    const sc = zoom * Math.min(0.48 * W / (ex + 0.8), 0.43 * H / (ey + 0.8));
    const X = p => W / 2 + p[0] * sc, Y = p => H / 2 + 8 - p[1] * sc;
    const fog = z => (isD ? 0.35 : 0.42) * (1 - (z - zmin) / Math.max(zmax - zmin, 1e-6));   // far = more fog
    const items = [];
    if (chkPoly.checked) for (const P of scene.polys) for (const f of P.faces) {
      const z = (pts[f[0]][2] + pts[f[1]][2] + pts[f[2]][2]) / 3;
      items.push({ z, kind: "face", f, poly: P.kind });
    }
    for (const b of scene.bonds) items.push({ z: (pts[b[0]][2] + pts[b[1]][2]) / 2, kind: "bond", b });
    scene.atoms.forEach((a, i) => items.push({ z: pts[i][2], kind: "atom", i }));
    items.sort((p, q) => p.z - q.z);
    g.lineCap = "round";
    for (const it of items) {
      if (it.kind === "face") {
        const [p, q, r] = it.f.map(k => pts[k]);
        const base = it.poly === "Zn" ? (isD ? [110, 150, 245] : [80, 115, 205]) : (isD ? [245, 180, 60] : [215, 145, 30]);
        const c = mix(base, bg, fog(it.z));
        // faces seen face-on (large projected area, in A^2) are a little more opaque
        const area = 0.5 * Math.abs((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
        const alpha = (isD ? 0.24 : 0.15) + 0.06 * Math.min(1, area / 6);
        g.beginPath(); g.moveTo(X(p), Y(p)); g.lineTo(X(q), Y(q)); g.lineTo(X(r), Y(r)); g.closePath();
        g.fillStyle = `rgba(${c},${alpha})`; g.fill();
        g.strokeStyle = `rgba(${c},${isD ? 0.8 : 0.65})`; g.lineWidth = 1; g.lineJoin = "round"; g.stroke();
      } else if (it.kind === "bond") {
        const [i0, i1] = it.b, p = pts[i0], q = pts[i1];
        const mxp = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
        for (const [a, e] of [[p, scene.atoms[i0].el], [q, scene.atoms[i1].el]]) {
          const c = mix(COLORS[e], bg, fog(it.z));
          g.strokeStyle = `rgb(${mix(c, [0, 0, 0], 0.35)})`; g.lineWidth = 0.26 * sc;
          g.beginPath(); g.moveTo(X(a), Y(a)); g.lineTo(W / 2 + mxp[0] * sc, H / 2 + 8 - mxp[1] * sc); g.stroke();
          g.strokeStyle = `rgb(${c})`; g.lineWidth = 0.17 * sc;
          g.beginPath(); g.moveTo(X(a), Y(a)); g.lineTo(W / 2 + mxp[0] * sc, H / 2 + 8 - mxp[1] * sc); g.stroke();
        }
      } else {
        const a = scene.atoms[it.i], p = pts[it.i], r = RADII[a.el] * sc * 0.72;
        const c = mix(COLORS[a.el], bg, fog(it.z));
        const hi = mix(c, [255, 255, 255], 0.65), lo = mix(c, [0, 0, 0], 0.45);
        const grd = g.createRadialGradient(X(p) - r * 0.38, Y(p) - r * 0.42, r * 0.05, X(p), Y(p), r * 1.02);
        grd.addColorStop(0, `rgb(${hi})`); grd.addColorStop(0.45, `rgb(${c})`); grd.addColorStop(1, `rgb(${lo})`);
        g.fillStyle = grd;
        g.beginPath(); g.arc(X(p), Y(p), r, 0, 2 * Math.PI); g.fill();
        g.strokeStyle = isD ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)"; g.lineWidth = 0.8; g.stroke();
      }
    }
    // animated displacement vectors, drawn over everything: each arrow is the
    // instantaneous displacement of its atom, scaled up so it reads at any amplitude
    if (chkArr.checked) {
      const L = (0.8 + 3 * A) * s;
      const col = isD ? "rgb(255,63,63)" : "rgb(204,0,0)";
      scene.atoms.forEach((a, i) => {
        const u = m.disp[a.base], p = pts[i];
        const d = [dot(u, R[0]) * L * sc, -dot(u, R[1]) * L * sc];
        const len = Math.hypot(d[0], d[1]);
        if (len < 4) return;
        const x0 = X(p), y0 = Y(p), x1 = x0 + d[0], y1 = y0 + d[1];
        const ang = Math.atan2(d[1], d[0]), hl = Math.min(9, 0.45 * len);
        const head = () => {
          g.beginPath(); g.moveTo(x1, y1);
          g.lineTo(x1 - hl * Math.cos(ang - 0.42), y1 - hl * Math.sin(ang - 0.42));
          g.lineTo(x1 - hl * Math.cos(ang + 0.42), y1 - hl * Math.sin(ang + 0.42));
          g.closePath();
        };
        g.lineCap = "round"; g.lineJoin = "round";
        g.strokeStyle = isD ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)"; g.lineWidth = 4.5;
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); head(); g.stroke();
        g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2.2;
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); head(); g.fill();
      });
    }
    // overlay: mode label and legend
    const txt = isD ? "rgba(235,235,235,0.92)" : "rgba(30,30,30,0.9)", mut = isD ? "rgba(200,200,200,0.7)" : "rgba(90,90,90,0.8)";
    const f = m.thz < 0 ? `${(-m.thz).toFixed(2)}i THz` : `${m.thz.toFixed(2)} THz`;
    g.font = "600 15px system-ui"; g.fillStyle = txt; g.fillText(f, 14, 24);
    const fw = g.measureText(f).width;
    g.font = "13px system-ui"; g.fillStyle = mut;
    g.fillText(m.thz < 0 ? `${m.irrep}, unstable` : `${m.cm.toFixed(0)} cm⁻¹   ${m.irrep}, ${act(m)} active`, 22 + fw, 24);
    let lx = 14;
    const ly = H - 16;
    for (const [lab, el2] of [["Zn", "Zn"], ["P", "P"], ["S", "S"]]) {
      const c = COLORS[el2];
      const grd = g.createRadialGradient(lx + 3, ly - 3, 1, lx + 6, ly, 7);
      grd.addColorStop(0, `rgb(${mix(c, [255, 255, 255], 0.6)})`); grd.addColorStop(1, `rgb(${mix(c, [0, 0, 0], 0.35)})`);
      g.fillStyle = grd; g.beginPath(); g.arc(lx + 6, ly, 6.5, 0, 2 * Math.PI); g.fill();
      g.fillStyle = txt; g.fillText(lab, lx + 16, ly + 4.5); lx += 16 + g.measureText(lab).width + 14;
    }
    if (chkPoly.checked) for (const [lab, c] of [["ZnS₆", [92, 128, 214]], ["P₂S₆", [226, 160, 48]]]) {
      g.fillStyle = `rgba(${c},0.35)`; g.strokeStyle = `rgba(${c},0.9)`; g.lineWidth = 1;
      g.beginPath(); g.moveTo(lx + 6, ly - 7); g.lineTo(lx + 13, ly); g.lineTo(lx + 6, ly + 7); g.lineTo(lx - 1, ly); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = txt; g.fillText(lab, lx + 18, ly + 4.5); lx += 18 + g.measureText(lab).width + 14;
    }
    root.querySelector(".w-spv").textContent = `${(+inSp.value).toFixed(1)} s (real period ${(1000 / Math.abs(m.thz)).toFixed(0)} fs)`;
    root.querySelector(".w-amv").textContent = `${A.toFixed(2)} Å`;
    root.querySelector(".w-info").innerHTML = `Kinetic energy carried by each element: ${share(m)}.`;
  }

  function tick(now) {
    if (playing) phase += 2 * Math.PI * (now - t0) / 1000 / +inSp.value;
    t0 = now;
    draw();
    raf = requestAnimationFrame(tick);
  }
  btnPlay.addEventListener("click", () => { playing = !playing; btnPlay.textContent = playing ? "Pause" : "Play"; });
  sel.addEventListener("change", () => { mi = +sel.value; });
  root.querySelector(".w-top-view").addEventListener("click", () => { R = basisFor(nrm, unit(cell[1])); zoom = 1; });
  root.querySelector(".w-side-view").addEventListener("click", () => { R = basisFor(unit(cell[1]), nrm); zoom = 1; });
  root.querySelector(".w-tilt-view").addEventListener("click", () => { R = tilted(); zoom = 1; });
  root.querySelector(".w-layers").addEventListener("change", e => {
    const n = +e.target.value;
    scene = buildScene(DATA, 5, 3, n, n === 1 ? RCUT : 7.5);
  });
  // Pointer gestures. One pointer (mouse or finger) rotates freely in 3D, like a
  // trackball. Two fingers pinch to zoom and twist to spin about the view axis.
  // The mouse wheel zooms.
  let zoom = 1;
  const ptrs = new Map();
  let pinch = null;
  function rotateZ(R, ang) {
    const c = Math.cos(ang), s = Math.sin(ang), [x, y, z] = R;
    return [add(scl(x, c), scl(y, s)), add(scl(x, -s), scl(y, c)), z];
  }
  function reortho(R) {
    const x = unit(R[0]), y = unit(sub(R[1], scl(x, dot(R[1], x))));
    return [x, y, cross(x, y)];
  }
  function twoState() {
    const [a, b] = [...ptrs.values()];
    return { d: Math.hypot(b.x - a.x, b.y - a.y), ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  cv.addEventListener("pointerdown", e => {
    cv.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2) pinch = { ...twoState(), zoom };
    cv.style.cursor = "grabbing";
    e.preventDefault();
  });
  cv.addEventListener("pointermove", e => {
    const p = ptrs.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 1) {
      const k = e.pointerType === "touch" ? 0.012 : 0.01;
      R = reortho(rotate(rotate(R, "y", dx * k), "x", dy * k));
    } else if (ptrs.size === 2 && pinch) {
      const st = twoState();
      zoom = Math.min(4, Math.max(0.4, pinch.zoom * st.d / Math.max(pinch.d, 1)));
      R = reortho(rotateZ(R, -(st.ang - pinch.ang)));
      pinch.ang = st.ang;
    }
    e.preventDefault();
  });
  const end = e => {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (ptrs.size === 0) cv.style.cursor = "grab";
  };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  cv.addEventListener("wheel", e => {
    zoom = Math.min(4, Math.max(0.4, zoom * Math.exp(-e.deltaY * 0.0015)));
    e.preventDefault();
  }, { passive: false });
  function syncTheme() { root.classList.toggle("w-dark", dark()); }
  const obs = new MutationObserver(syncTheme);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  syncTheme();
  raf = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(raf); obs.disconnect(); };
}

export default { render, buildScene };
