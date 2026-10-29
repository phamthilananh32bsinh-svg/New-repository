export type TrueFalseQuestion = { id: string; statement: string; answer: boolean; explanation: string; topic: string };
export type FillQuestion = { id: string; explanation: string; before?: string; after?: string; answer?: string; parts?: string[]; answers?: string[] };
export type FillGroup = { id: string; title: string; words: string[]; questions: FillQuestion[] };
export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {id:'tf01',topic:'Fundamentals',statement:'Photosynthesis converts light energy into chemical energy.',answer:true,explanation:'Light energy is converted into chemical energy stored in organic molecules.'},
  {id:'tf02',topic:'Chloroplast',statement:'The Calvin cycle takes place inside the thylakoid lumen.',answer:false,explanation:'The Calvin cycle takes place in the stroma of the chloroplast.'},
  {id:'tf03',topic:'Light reactions',statement:'Water splitting contributes electrons to the light reactions.',answer:true,explanation:'Photolysis supplies electrons and releases oxygen.'},
  {id:'tf04',topic:'Light reactions',statement:'ATP and NADPH are used by the Calvin cycle.',answer:true,explanation:'They provide energy and reducing power for carbon fixation and reduction.'},
  {id:'tf05',topic:'Pigments',statement:'Carotenoids can act as accessory photosynthetic pigments.',answer:true,explanation:'They broaden light absorption and help protect photosynthetic machinery.'},
  {id:'tf06',topic:'Calvin cycle',statement:'The Calvin cycle produces glucose directly as its immediate sugar product.',answer:false,explanation:'Its immediate exported sugar product is G3P, which can contribute to glucose synthesis.'},
  {id:'tf07',topic:'Plant adaptations',statement:'CAM plants typically open their stomata at night.',answer:true,explanation:'Night-time opening reduces water loss in dry environments.'},
  {id:'tf08',topic:'Environmental factors',statement:'Increasing light intensity always increases the photosynthesis rate without limit.',answer:false,explanation:'The rate eventually reaches saturation and other factors become limiting.'},
  {id:'tf09',topic:'Plant adaptations',statement:'C4 plants initially fix carbon in mesophyll cells.',answer:true,explanation:'Initial carbon fixation occurs in mesophyll cells; the Calvin cycle is concentrated in bundle sheath cells.'},
  {id:'tf10',topic:'Environmental factors',statement:'Temperature can affect the enzymes involved in photosynthesis.',answer:true,explanation:'Photosynthetic reactions depend on enzymes with temperature-sensitive activity.'},
  {id:'tf11',topic:'Chloroplast',statement:'The thylakoid membrane contains components of the photosynthetic electron transport chain.',answer:true,explanation:'Photosystems and electron carriers are embedded in the thylakoid membrane.'},
  {id:'tf12',topic:'Plant adaptations',statement:'All plants have the same light saturation point.',answer:false,explanation:'Light saturation depends on species and environmental adaptation.'}
];
export const FILL_GROUPS: FillGroup[] = [
 {id:'structures',title:'Structures & Pigments',words:['Chloroplast','Stroma','Thylakoid membrane','Chlorophyll','Grana','Carotenoids'],questions:[
 {id:'s1',before:'The ',after:' is the organelle responsible for photosynthesis in plants.',answer:'Chloroplast',explanation:'Chloroplasts contain the machinery for photosynthesis.'},
 {id:'s2',before:'The Calvin cycle occurs in the ',after:'.',answer:'Stroma',explanation:'The stroma is the fluid-filled compartment of the chloroplast.'},
 {id:'s3',before:'The light reactions take place at the ',after:'.',answer:'Thylakoid membrane',explanation:'The membrane houses photosystems and electron transport proteins.'},
 {id:'s4',before:'The main green photosynthetic pigment is ',after:'.',answer:'Chlorophyll',explanation:'Chlorophyll absorbs light energy.'},
 {id:'s5',before:'Stacks of thylakoids are called ',after:'.',answer:'Grana',explanation:'Grana are stacks of thylakoid discs.'},
 {id:'s6',before:'Accessory pigments that also provide photoprotection include ',after:'.',answer:'Carotenoids',explanation:'Carotenoids absorb additional wavelengths and help dissipate excess energy.'}
 ]},
 {id:'processes',title:'Light Reactions & Calvin Cycle',words:['Photolysis','ATP','NADPH','Oxygen','RuBP','G3P'],questions:[
 {id:'p1',before:'The splitting of water using light energy is called ',after:'.',answer:'Photolysis',explanation:'Photolysis releases electrons, protons and oxygen.'},
 {id:'p2',before:'The main energy-carrying molecule produced by photophosphorylation is ',after:'.',answer:'ATP',explanation:'ATP provides energy for reactions in the Calvin cycle.'},
 {id:'p3',before:'The reduced electron carrier used in the Calvin cycle is ',after:'.',answer:'NADPH',explanation:'NADPH provides reducing power.'},
 {id:'p4',before:'Water splitting releases molecular ',after:' into the environment.',answer:'Oxygen',explanation:'Oxygen is a by-product of photolysis.'},
 {id:'p5',before:'The five-carbon CO₂ acceptor in the Calvin cycle is ',after:'.',answer:'RuBP',explanation:'RuBP combines with CO₂ during carbon fixation.'},
 {id:'p6',before:'The three-carbon sugar phosphate that can leave the Calvin cycle is ',after:'.',answer:'G3P',explanation:'G3P can be used to synthesize carbohydrates.'}
 ]},
 {id:'adaptations',title:'Plant Types & Environment',words:['CAM plants','C4 plants','Stomata','Light saturation point','Mesophyll','Bundle sheath'],questions:[
 {id:'a1',before:'Plants that often open stomata at night are ',after:'.',answer:'CAM plants',explanation:'CAM plants separate initial CO₂ fixation and the Calvin cycle in time.'},
 {id:'a2',before:'Plants with spatial separation of initial CO₂ fixation and the Calvin cycle include ',after:'.',answer:'C4 plants',explanation:'C4 plants use mesophyll and bundle sheath cells.'},
 {id:'a3',before:'Leaf pores controlling gas exchange are called ',after:'.',answer:'Stomata',explanation:'Stomata regulate CO₂ uptake and water loss.'},
 {id:'a4',before:'The light level beyond which more light does not increase the rate is the ',after:'.',answer:'Light saturation point',explanation:'Other factors limit the rate at saturation.'},
 {id:'a5',before:'In C4 plants, initial carbon fixation occurs in the ',after:' cells.',answer:'Mesophyll',explanation:'Mesophyll cells initially fix carbon in C4 photosynthesis.'},
 {id:'a6',before:'In many C4 plants, the Calvin cycle is concentrated in the ',after:' cells.',answer:'Bundle sheath',explanation:'Bundle sheath cells concentrate CO₂ around Rubisco.'}
 ]},
 {id:'multi',title:'Two-Blank Challenge',words:['ATP','NADPH','Stroma','Thylakoid membrane','ATP','NADPH'],questions:[
 {id:'m1',parts:['The light reactions produce ',' and ','.'],answers:['ATP','NADPH'],explanation:'ATP and NADPH transfer energy and reducing power to the Calvin cycle.'},
 {id:'m2',parts:['The Calvin cycle uses ',' and ','.'],answers:['ATP','NADPH'],explanation:'Both ATP and NADPH are consumed during the Calvin cycle.'},
 {id:'m3',parts:['The Calvin cycle takes place in the ', ', while the light reactions occur at the ','.'],answers:['Stroma','Thylakoid membrane'],explanation:'The two phases occur in different chloroplast compartments.'}
 ]}

];
