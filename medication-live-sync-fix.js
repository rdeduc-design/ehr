(function () {
  const ROWS = String.raw`acetaminophen|acetaminophen|~acetylcysteine|acetylcysteine|~acyclovir|acyclovir|~adagrasib|adagrasib|Krazati~adalimumab|adalimumab|Abrilada, Cyltezo~ado-trastuzumab-emtansine|ado-trastuzumab emtansine|Kadcyla~afatinib|afatinib|Gilotrif~albumin|albumin|Albuked-5, Albuked-25~albuterol|albuterol|~alectinib|alectinib|~alendronate|alendronate|Binosto, Fosamax~allopurinol|allopurinol|Aloprim, Zyloprim~almotriptan|almotriptan|~alpelisib|alpelisib|~amikacin|amikacin|~amiodarone|amiodarone|Nexterone, Pacerone~amitriptyline|amitriptyline|~amivantamab-vmjw|amivantamab-vmjw|Rybrevant~amoxicillin|amoxicillin|~amoxicillin-clavulanate|amoxicillin/clavulanate|~amphotericin-b|amphotericin B|~ampicillin|ampicillin|~ampicillin-sulbactam|ampicillin/sulbactam|Unasyn~anastrozole|anastrozole|Arimidex~anidulafungin|anidulafungin|Eraxis~apalutamide|apalutamide|Erleada~apixaban|apixaban|Eliquis~apremilast|apremilast|Otezla~aprepitant-fosaprepitant|aprepitant/fosaprepitant|Cinvanti, Emend~argatroban|argatroban|~asciminib|asciminib|Scemblix~aspirin|aspirin|Ascriptin, Bayer~atezolizumab|atezolizumab|Tecentriq~avapritinib|avapritinib|Ayvakit~avelumab|avelumab|Bavencio~axitinib|axitinib|Inlyta~azacitidine|azacitidine|Onureg, Vidaza~azithromycin|azithromycin|AzaSite, Zithromax~aztreonam|aztreonam|Azactam, Cayston~baclofen|baclofen|Fleqsuvy, Gablofen~baricitinib|baricitinib|Olumiant~beclomethasone|beclomethasone|Beconase AQ, QNASL~belinostat|belinostat|Beleodaq~benazepril|benazepril|Lotensin~bendamustine|bendamustine|Belrapzo, Bendeka~benralizumab|benralizumab|Fasenra, Fasenra Pen~bethanechol|bethanechol|~bevacizumab|bevacizumab|Alymsys, Avastin~bexagliflozin|bexagliflozin|Brenzavvy~bictegravir-emtricitabine-tenofovir|bictegravir/emtricitabine/tenofovir|Biktarvy~binimetinib|binimetinib|Mektovi~bisoprolol|bisoprolol|~blinatumomab|blinatumomab|Blincyto~bortezomib|bortezomib|Velcade~bosutinib|bosutinib|Bosulif~brentuximab-vedotin|brentuximab vedotin|Adcetris~brexpiprazole|brexpiprazole|Rexulti~brigatinib|brigatinib|Alunbrig~budesonide|budesonide|Entocort EC, Ortikos~bumetanide|bumetanide|~cabazitaxel|cabazitaxel|Jevtana~cabotegravir-rilpivirine|cabotegravir/rilpivirine|Cabenuva~cabozantinib|cabozantinib|Cabometyx, Cometriq~calcium-acetate|calcium acetate|Eliphos, PhosLo~calcium-carbonate|calcium carbonate|~calcium-chloride|calcium chloride|~calcium-gluconate|calcium gluconate|~canagliflozin|canagliflozin|Invokana~capecitabine|capecitabine|Xeloda~capmatinib|capmatinib|Tabrecta~captopril|captopril|~carbamazepine|carBAMazepine|Carbatrol, Epitol~carbidopa-levodopa|carbidopa/levodopa|~carfilzomib|carfilzomib|Kyprolis~cariprazine|cariprazine|Vraylar~carvedilol|carvedilol|~caspofungin|caspofungin|Cancidas~cefaclor|cefaclor|~cefadroxil|cefadroxil|~cefdinir|cefdinir|~cefepime|cefepime|~cefotaxime|cefotaxime|~ceftaroline|ceftaroline|Teflaro~ceftazidime|cefTAZidime|Tazicef~ceftazidime-avibactam|cefTAZidime/avibactam|Avycaz~ceftolozane-tazobactam|ceftolozane/tazobactam|Zerbaxa~cefuroxime|cefuroxime|~celecoxib|celecoxib|CeleBREX, Elyxyb~cemiplimab-rwic|cemiplimab-rwic|Libtayo~cephalexin|cephalexin|~ceritinib|ceritinib|Zykadia~certolizumab-pegol|certolizumab pegol|Cimzia, Cimzia Prefilled~cetirizine|cetirizine|~cetuximab|cetuximab|Erbitux~chlorambucil|chlorambucil|Leukeran~cinacalcet|cinacalcet|Sensipar~ciprofloxacin|ciprofloxacin|Cetraxal, Ciloxan~citalopram|citalopram|CeleXA~clarithromycin|clarithromycin|~clevidipine|clevidipine|Cleviprex~clindamycin|clindamycin|Cleocin, Cleocin T~clofarabine|clofarabine|Clolar~clonazepam|clonazePAM|~cobimetinib|cobimetinib|Cotellic~colchicine|colchicine|Colcrys, Gloperba~copanlisib|copanlisib|Aliqopa~crizotinib|crizotinib|Xalkori~cyclobenzaprine|cyclobenzaprine|Amrix, Fexmid~cyclophosphamide|cycloPHOSphamide|~cytarabine|cytarabine|~dabigatran|dabigatran|Pradaxa~dabrafenib|dabrafenib|Tafinlar~dacomitinib|dacomitinib|Vizimpro~dalfampridine|dalfampridine|~dalteparin|dalteparin|Fragmin~dantrolene|dantrolene|Dantrium, Revonto~dapagliflozin|dapagliflozin|Farxiga~daratumumab|daratumumab|Darzalex~daratumumab-hyaluronidase-fihj|daratumumab/hyaluronidase fihj|Darzalex Faspro~darbepoetin-alfa|darbepoetin alfa|Aranesp~darifenacin|darifenacin|~darolutamide|darolutamide|Nubeqa~darunavir|darunavir|Prezista~dasatinib|dasatinib|Sprycel~denosumab|denosumab|Prolia, Xgeva~desmopressin|desmopressin|DDAVP, Nocduma~deucravacitinib|deucravacitinib|Sotyktu~dexamethasone|dexamethasone|Dexamethasone Intensol, Maxidex~dexmedetomidine|dexmedetomidine|Igalmi, Precedex~dextroamphetamine-and-amphetamine|dextroamphetamine and amphetamine|Adderall, Adderall-XR~diclofenac|diclofenac|Cambia, Cataflam~dimethyl-fumarate|dimethyl fumarate|Tecfldera~diroximel-fumarate|diroximel fumarate|Vumerity~dofetilide|dofetilide|Tikosyn~dolutegravir|dolutegravir|Tivicay, Tivicay PD~donepezil|donepezil|~dostarlimab-gxly|dostarlimab-gxly|Jemperli~doxazosin|doxazosin|~doxepin|doxepin|Prudoxin, Silenor~doxycycline|doxycycline|~dulaglutide|dulaglutide|Trulicity~dupilumab|dupilumab|Dupixent~durvalumab|durvalumab|Imfinzi~duvelisib|duvelisib|Copiktra~elacestrant|elacestrant|Orserdu~elbasvir-grazoprevir|elbasvir/grazoprevir|Zepatier~eletriptan|eletriptan|Relpax~elexacaftor-tezacaftor-ivacaftor|elexacaftor/tezacaftor/ivacaftor|Trikafta~elotuzumab|elotuzumab|Empliciti~empagliflozin|empagliflozin|Jardiance~emtricitabine|emtricitabine|Emtriva~enalapril|enalapril|Epaned, Vasotec~enasidenib|enasidenib|Idhifa~encorafenib|encorafenib|Braftovi~enfortumab-vedotin-ejfv|enfortumab vedotin-ejfv|Padcev~enoxaparin|enoxaparin|Lovenox~entrectinib|entrectinib|Rozlytrek~enzalutamide|enzalutamide|~epcoritamab-bysp|epcoritamab-bysp|Epkinly~eplerenone|eplerenone|Inspra~epoetin-alfa|epoetin alfa|~erdafitinib|erdafitinib|Balversa~erlotinib|erlotinib|Tarceva~ertapenem|ertapenem|INVanz~erythromycin|erythromycin|~escitalopram|escitalopram|~esmolol|esmolol|Brevibloc~esomeprazole|esomeprazole|NexIUM, NexIUM 24 HR~estradiol|estradiol|~etanercept|etanercept|Enbrel, Enbrel SureClick~everolimus|everolimus|Afinitor, Afinitor Disperz~exemestane|exemestane|Aromasin~ezetimibe|ezetimibe|~famciclovir|famciclovir|~famotidine|famotidine|~febuxostat|febuxostat|Uloric~ferric-carboxymaltose|ferric carboxymaltose|~ferric-gluconate|ferric gluconate|~ferrous-fumarate|ferrous fumarate|~ferrous-gluconate|ferrous gluconate|~ferrous-sulfate|ferrous sulfate|~ferumoxytol|ferumoxytol|~fesoterodine|fesoterodine|Toviaz~fexofenadine|fexofenadine|Allegra Allergy, Allegra Allergy Childrens~fidaxomicin|fidaxomicin|Dificid~filgrastim|filgrastim|Granix, Neupogen~finasteride|finasteride|Propecia, Proscar~finerenone|finerenone|Kerendia~fingolimod|fingolimod|Gilenya~fluconazole|fluconazole|Diflucan~fluticasone|fluticasone|~fondaparinux|fondaparinux|~fosphenytoin|fosphenytoin|Cerebyx~frovatriptan|frovatriptan|Frova~furosemide|furosemide|~gabapentin|gabapentin|Gralise, Horizant~galantamine|galantamine|Razadyne ER~gefitinib|gefitinib|~gemcitabine|gemcitabine|Infugem~gentamicin|gentamicin|~gilteritinib|gilteritinib|Xospata~glasdegib|glasdegib|Daurismo~glatiramer|glatiramer|~glecaprevir-pibrentasvir|glecaprevir/pibrentasvir|Mavyret~golimumab|golimumab|Simponi, Simponi Aria~goserelin|goserelin|~granisetron|granisetron|Sancuso, Sustol~guselkumab|guselkumab|Tremfya~haloperidol|haloperidol|~heparin|heparin|~hydrocortisone|hydrocortisone|Anusol HC, Cortaid~hydroxyzine|hydrOXYzine|~ibandronate|ibandronate|Boniva~ibrutinib|ibrutinib|Imbruvica~ibuprofen|ibuprofen|Advil, Caldolor~ifosfamide|ifosfamide|Ifex~iloperidone|iloperidone|Fanapt, Fanapt Titration Pack~imatinib|imatinib|Gleevec~indomethacin|indomethacin|Indocin, Tivorbex~inotuzumab-ozogamicin|inotuzumab ozogamicin|Besponsa~insulin|insulin|~ipilimumab|ipilimumab|Yervoy~ipratropium|ipratropium|~irbesartan|irbesartan|Avapro~irinotecan|irinotecan|Camptosar, Onivyde~isatuximab-irfc|isatuximab-irfc|Sarclisa~isavuconazonium|isavuconazonium|Cresemba~isoniazid|isoniazid|~isosorbide-dinitrate|isosorbide dinitrate|~isosorbide-mononitrate|isosorbide mononitrate|~itraconazole|itraconazole|Sporanox, Tolsura~ivabradine|ivabradine|Corlanor~ivosidenib|ivosidenib|Tibsovo~ixabepilone|ixabepilone|Ixempra~ixazomib|ixazomib|Ninlaro~ixekizumab|ixekizumab|Taltz~ketorolac|ketorolac|~labetalol|labetalol|~lacosamide|lacosamide|Motpoly XR, Vimpat~lamivudine|lamiVUDine|~lamotrigine|lamoTRIgine|LaMICtal, LaMICtal ODT~lansoprazole|lansoprazole|Prevacid, Prevacid Solu-Tab~lapatinib|lapatinib|Tykerb~larotrectinib|larotrectinib|Vitrakvi~lecanemab-irmb|lecanemab-irmb|Leqembi~ledipasvir-sofosbuvir|ledipasvir/sofosbuvir|Harvoni~leflunomide|leflunomide|~lenalidomide|lenalidomide|Revlimid~lenvatinib|lenvatinib|Lenvima~letrozole|letrozole|Femara~leucovorin|leucovorin|~leuprolide|leuprolide|~levalbuterol|levalbuterol|Xopenex, Xopenex HFA~levothyroxine|levothyroxine|~linagliptin|linagliptin|Tradjenta~linezolid|linezolid|~liraglutide|liraglutide|Saxenda, Victoza~lisinopril|lisinopril|Qbrelis, Zestril~lisocabtagene-maraleucel|lisocabtagene maraleucel|Breyanzi~lithium|lithium|~loratadine|loratadine|Claritin, Claritin Reditabs~lorlatinib|lorlatinib|Lorbrena~losartan|losartan|Cozaar~lovastatin|lovastatin|Altoprev~lurasidone|lurasidone|Latuda~lurbinectedin|lurbinectedin|Zepzelca~magnesium|magnesium|~magnesium-chloride|magnesium chloride|Mag-Delay, Slow-Mag~magnesium-citrate|magnesium citrate|~magnesium-hydroxide|magnesium hydroxide|Milk of Magnesia~magnesium-oxide|magnesium oxide|Mag-Ox 400, Uro-Mag~magnesium-sulfate|magnesium sulfate|Epsom salt, magnesium sulfate injection~mannitol|mannitol|Osmitrol~margetuximab-cmkb|margetuximab-cmkb|Margenza~mavacamten|mavacamten|Camzyos~megestrol|megestrol|~meloxicam|meloxicam|Anjeso, Vivlodex~memantine|memantine|~mepolizumab|mepolizumab|Nucala~meropenem|meropenem|~mesalamine|mesalamine|~methadone|methadone|~methotrexate|methotrexate|Otrexup, Rasuvo~methylergonovine|methylergonovine|Methergine~methylnaltrexone|methylnaltrexone|Relistor~methylphenidate|methylphenidate|~methylprednisolone-acetate|methylPREDNISolone acetate|DEPO-Medrol~methylprednisolone-sodium-succinate|methylPREDNISolone sodium succinate|SOLU-Medrol~metolazone|metOLazone|~metoprolol|metoprolol|Kaspargo Sprinkle, Lopressor~micafungin|micafungin|Mycamine~midazolam|midazolam|Nayzilam~midostaurin|midostaurin|Rydapt~milrinone|milrinone|~mirabegron|mirabegron|Myrbetriq~mirtazapine|mirtazapine|Remeron, Remeron Soltab~mirvetuximab-soravtansine-gynx|mirvetuximab soravtansine-gynx|Elahere~mitomycin|mitoMYcin|Mutamycin~mobocertinib|mobocertinib|Exkivity~modafinil|modafinil|~mometasone|mometasone|~montelukast|montelukast|Singulair~morphine|morphine|~mosunetuzumab-axgb|mosunetuzumab-axgb|Lunsumio~mycophenolate|mycophenolate|CellCept, Myfortic~nafcillin|nafcillin|~naloxone|naloxone|Kloxxado, Narcan~naproxen|naproxen|Aleve, EC-Naprosyn~naratriptan|naratriptan|Amerge~naxitamab-gqgk|naxitamab-gqgk|Danyelza~neratinib|neratinib|Nerlynx~nicardipine|niCARdipine|Cardene IV~nicotine|nicotine|~nimodipine|niMODipine|~niraparib|niraparib|Zejula~nirmatrelvir-ritonavir|nirmatrelvir/ritonavir|Paxlovid~nitrofurantoin|nitrofurantoin|Macrobid, Macrodantin~nitroglycerin|nitroglycerin|~nivolumab|nivolumab|Opdivo~norepinephrine|norepinephrine|Levophed~obinutuzumab|obinutuzumab|Gazyva~ocrelizumab|ocrelizumab|Ocrevus~octreotide|octreotide|Mycapssa, SandoSTATIN~ofatumumab|ofatumumab|Kesimpta~olaparib|olaparib|Lynparza~olutasidenib|olutasidenib|Rezlidhia~omalizumab|omalizumab|Xolair~omeprazole|omeprazole|~ondansetron|ondansetron|Zofran, Zuplenz~oseltamivir|oseltamivir|Tamiflu~osimertinib|osimertinib|Tagrisso~oxaliplatin|oxaliplatin|~oxytocin|oxytocin|Pitocin~ozanimod|ozanimod|Zeposia~palbociclib|palbociclib|Lbrance~paliperidone|paliperidone|Invega, Invega Hafyera~palonosetron|palonosetron|~panitumumab|panitumumab|Vectibix~pantoprazole|pantoprazole|~pegfilgrastim|pegfilgrastim|~pembrolizumab|pembrolizumab|Keytruda~penicillin-g-potassium|penicillin G potassium|Pfizerpen-G~penicillin-v-potassium|penicillin V potassium|~pertuzumab|pertuzumab|Perjeta~pertuzumab-trastuzumab-hyaluronidase-zzxf|pertuzumab/trastuzumab/hyaluronidase-zzxf|Phesgo~phenylephrine|phenylephrine|AK-Dilate, Mydfrin~phenytoin|phenytoin|Dilantin, Phenytek~piperacillin-tazobactam|piperacillin/tazobactam|Zosyn~pomalidomide|pomalidomide|Pomalyst~ponatinib|ponatinib|Iclusig~ponesimod|ponesimod|Ponvory~potassium-bicarbonate-citrate|potassium bicarbonate/citrate|Effer-K, Klor-Con EF~potassium-chloride|potassium chloride|Kaon-Cl, Klor-Con~pralsetinib|pralsetinib|Gavreto~pramipexole|pramipexole|~pravastatin|pravastatin|~pregabalin|pregabalin|Lyrica, Lyrica CR~propofol|propofol|Diprivan, Fresenius Propoven~propranolol|propranolol|Hemangeol, Inderal LA~pyridostigmine|pyRIDostigmine|~quinapril|quinapril|Accupril~raloxifene|raloxifene|Evista~ramelteon|ramelteon|Rozerem~ramipril|ramipril|Altace~ramucimmab|ramucimmab|Cyramza~rasagiline|rasagiline|~rasburicase|rasburicase|~regorafenib|regorafenib|Stivarga~remdesivir|remdesivir|Veklury~reslizumab|reslizumab|Cinqair~rezafungin|rezafungin|Rezzayo~ribavirin|ribavirin|Virazole~ribociclib|ribociclib|Kisqali~rimegepant|rimegepant|Nurtec ODT~ripretinib|ripretinib|Qinlock~risankizumab-rzaa|risankizumab-rzaa|Skyrizi~risedronate|risedronate|Actonel, Atelvia~rivaroxaban|rivaroxaban|Xarelto~rivastigmine|rivastigmine|Exelon~rizatriptan|rizatriptan|~romosozumab-aqqg|romosozumab-aqqg|Evenity~rosuvastatin|rosuvastatin|~rucaparib|rucaparib|Rubraca~rufinamide|rufinamide|Banzel~ruxolitinib|ruxolitinib|Jakafi~sacituzumab-govitecan-hziy|sacituzumab govitecan-hziy|Trodelvy~sacubitril-valsartan|sacubitril-valsartan|Entresto~salmeterol|salmeterol|Serevent Diskus~sargramostim|sargramostim|Leukine~sarilumab|sarilumab|Kevzara~saxagliptin|sAXagliptin|Onglyza~secukinumab|secukinumab|Cosentyx, Cosentyx Sensor Pen~selegiline|selegiline|Emsam, Zelapar~selinexor|selinexor|Xpovio~selpercatinib|selpercatinib|Retevmo~semaglutide|semaglutide|Ozempic, Rybelsus~sertraline|sertraline|Zoloft~sevelamer|sevelamer|Renagel, Renvela~simvastatin|simvastatin|FloLipid, Zocor~siponimod|siponimod|Mayzent~sirolimus|sirolimus|Rapamune~sodium-bicarbonate|sodium bicarbonate|~sodium-chloride|sodium chloride|Muro 128, Nasal Moist~sofosbuvir-velpatasvir|sofosbuvir/velpatasvir|Epclusa~solifenacin|solifenacin|VESIcare, VESIcare LS~somatropin|somatropin|~sonidegib|sonidegib|Odomzo~sotagliflozin|sotagliflozin|Inpefa~sotalol|sotalol|Betapace, Betapace AF~sotorasib|sotorasib|Lumakras~spironolactone|spironolactone|Aldactone, CaroSpir~sulfamethoxazole-trimethoprim|sulfamethoxazole-trimethoprim|Bactrim, Bactrim DS~tacrolimus|tacrolimus|Astagraf XL, Envarsus XR~tafasitamab-cxix|tafasitamab-cxix|Monjuvi~talazoparib|talazoparib|Talzenna~tamoxifen|tamoxifen|~tamsulosin|tamsulosin|~tapentadol|tapentadol|~teclistamab-cqyv|teclistamab-cqyv|Tecvayli~temozolomide|temozolomide|~tenecteplase|tenecteplase|TNKase~tepotinib|tepotinib|Tepmetko~teriflunomide|teriflunomide|Aubagio~teriparatide|teriparatide|Forteo~testosterone|testosterone|~tezepelumab-ekko|tezepelumab-ekko|~ticagrelor|ticagrelor|Brilinta~tigecycline|tigecycline|Tygacil~tildrakizumab-asmn|tildrakizumab-asmn|Ilumya~tiotropium|tiotropium|Spiriva Handihaler, Spiriva Respimat~tipiracil-trifluridine|tipiracil/trifluridine|Lonsurf~tirzepatide|tirzepatide|Mounjaro, Zepbound~tisagenlecleucel|tisagenlecleucel|Kymriah~tisotumab-vedotin-tftv|tisotumab vedotin-tftv|Tivdak~tivozanib|tivozanib|Fotivda~tobramycin|tobramycin|TOBI, Tobrex~tocilizumab|tocilizumab|Actemra~tofacitinib|tofacitinib|Xeljanz, Xeljanz XR~tolterodine|tolterodine|Detrol, Detrol LA~topiramate|topiramate|Eprontia, Qudexy XR~topotecan|topotecan|Hycamtin~torsemide|torsemide|~trametinib|trametinib|Mekinist~trastuzumab|trastuzumab|Herceptin, Herzuma~trastuzumab-hyaluronidase|trastuzumab/hyaluronidase|Herceptin Hylecta~tremelimumab-actl|tremelimumab-actl|Imjudo~trospium|trospium|~tucatinib|tucatinib|Tukysa~ublituximab-xiiy|ublituximab-xiiy|Briumvi~ubrogepant|ubrogepant|Ubrelvy~umeclidinium|umeclidinium|Incruse Ellipta~upadacitinib|upadacitinib|Rinvoq~ustekinumab|ustekinumab|Stelara~valacyclovir|valACYclovir|Valtrex~valproic-acid|valproic acid|~valsartan|valsartan|~vancomycin|vancomycin|Firvanq, Vancocin~vandetanib|vandetanib|Caprelsa~varenicline|varenicline|~vasopressin|vasopressin|Vasostrict~vedolizumab|vedolizumab|Entyvio, Entivio Pen~vemurafenib|vemurafenib|Zelboraf~venetoclax|venetoclax|Venclexta~venlafaxine|venlafaxine|Effexor XR~verapamil|verapamil|Calan SR, Verelan~vibegron|vibegron|Gemtesa~vilazodone|vilazodone|Viibryd~viloxazine|viloxazine|Qelbree~vinorelbine|vinorelbine|Navelbine~vismodegib|vismodegib|Erivedge~calcitriol|calcitriol|~doxercalciferol|doxercalciferol|Hectorol~ergocalciferol|ergocalciferol|Drisdol~paricalcitol|paricalcitol|Zemplar~voriconazole|voriconazole|~vortioxetine|vortioxetine|~warfarin|warfarin|Jantoven~zanamivir|zanamivir|Relenza Diskhaler~zanubrutinib|zanubrutinib|Brukinsa~zavegepant|zavegepant|Zavzpret~zidovudine|zidovudine|Retrovir~ziprasidone|ziprasidone|~ziv-aflibercept|ziv-aflibercept|Zaltrap~zoledronic-acid|zoledronic acid|~zonisamide|zonisamide|Zonisade`;
  const KEYS = ["hct_his_v1", "hct_his_online_mode_v1", "hct_his_online_mode_v2"];
  const clientId = localStorage.hct_med_live_client || (localStorage.hct_med_live_client = "medlive_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
  const channelName = "hct-ehr-medication-live-v3";
  let bc = null, live = null, applying = false, enhanceTimer = 0, publishTimer = 0, lastEventStamp = localStorage.hct_med_last_event || "";

  const H = () => window.HctMedicationInventory;
  const parse = key => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { return null; } };
  const save = (key, value) => { localStorage.setItem(key, JSON.stringify(value)); };
  const esc = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = v => String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const role = () => { try { return cloud?.profile?.role || localStorage.getItem("hct_role") || "student"; } catch (_) { return "student"; } };
  const who = () => { try { return cloud?.profile?.full_name || cloud?.session?.user?.email || localStorage.getItem("hct_user_name") || "Care team member"; } catch (_) { return "Care team member"; } };

  function unitFor(name) {
    const s = String(name || "").toLowerCase();
    if (/tablet|tab\b/.test(s)) return "tablet(s)";
    if (/capsule|cap\b/.test(s)) return "capsule(s)";
    if (/syrup|suspension|solution|elixir|drops|injection|vial|ampule|nebule|insulin|oxytocin|albumin|saline|ringer|chloride/.test(s)) return "mL";
    if (/cream|ointment|gel|lotion|topical/.test(s)) return "application(s)";
    if (/inhaler|diskus|respimat/.test(s)) return "puff(s)";
    if (/suppository/.test(s)) return "suppository(ies)";
    return "unit(s)";
  }

  function doseFor(item) {
    if (Array.isArray(item.doses) && item.doses.length) return item.doses;
    const s = String(item.name || "").toLowerCase();
    if (/insulin/.test(s)) return ["Per sliding scale SQ", "2 units SQ", "4 units SQ", "6 units SQ", "0.1 unit/kg/hr IV"];
    if (/saline|ringer/.test(s)) return ["75 mL/hr IV", "125 mL/hr IV", "500 mL IV bolus", "1 L IV bolus"];
    if (/tablet/.test(s)) return ["1 tablet PO", "2 tablets PO", "1 tablet PO daily", "1 tablet PO PRN"];
    if (/capsule/.test(s)) return ["1 capsule PO", "2 capsules PO", "1 capsule PO daily"];
    if (/vial|ampule|injection/.test(s)) return ["1 mL IV/IM per order", "2 mL IV/IM per order", "Dose per provider order"];
    if (/nebule|albuterol|ipratropium/.test(s)) return ["1 nebule via nebulizer", "2.5 mg nebulized", "Per respiratory protocol"];
    return ["Dose per provider order", "Standard adult dose", "Pediatric/weight-based dose"];
  }

  function makeItem(row, i) {
    const [id, name, brand] = row;
    const unit = unitFor(name);
    const qty = 18 + (i % 9) * 6;
    return {
      id: id || slug(name), name, generic: name, brand: brand || "", category: categoryFor(name), aliases: `${name} ${brand || ""}`,
      onHand: qty, par: Math.max(6, Math.round(qty / 3)), qty, unit, doses: doseFor({ name }), availability: `${unit}; formulary inventory`,
      classification: categoryFor(name), uses: "See provider order and drug handbook entry for approved clinical use.",
      precautions: "Check allergies, contraindications, duplicate therapy, pregnancy/lactation considerations, renal/hepatic parameters, and route before administration.",
      action: "Drug-specific action is available in the Saunders monograph; verify mechanism before teaching or administration.",
      nursing: "Apply medication-rights checks, verify dose/route/time, monitor response, and document amount actually given.",
      indications: "Use only for the ordered indication and patient scenario.", sideEffects: "Monitor expected and patient-reported side effects.", adverseEffects: "Stop and escalate for severe allergy, toxicity, bleeding, respiratory compromise, dysrhythmia, or other serious reaction."
    };
  }

  function categoryFor(name) {
    const s = String(name || "").toLowerCase();
    if (/cef|cillin|cycline|mycin|penicillin|meropenem|ertapenem|vancomycin|aztreonam|floxacin|sulfamethoxazole|trimethoprim|nitrofurantoin/.test(s)) return "Anti-infective";
    if (/insulin|gliflozin|glutide|metformin|gliptin|tirzepatide/.test(s)) return "Endocrine / antidiabetic";
    if (/pril|sartan|olol|dipine|statin|nitrate|nitroglycerin|furosemide|bumetanide|torsemide|spironolactone|warfarin|heparin|apixaban|rivaroxaban|dabigatran|ticagrelor|tenecteplase/.test(s)) return "Cardiovascular / anticoagulant";
    if (/mab|nib|zumab|tinib|platin|taxel|trexate|cyclophosphamide|cytarabine|gemcitabine/.test(s)) return "Oncology / biologic";
    if (/albuterol|ipratropium|salmeterol|tiotropium|fluticasone|budesonide|mometasone|montelukast|omalizumab/.test(s)) return "Respiratory";
    if (/morphine|methadone|tapentadol|gabapentin|pregabalin|ibuprofen|naproxen|ketorolac|acetaminophen|celecoxib|diclofenac|meloxicam|aspirin/.test(s)) return "Analgesic / anti-inflammatory";
    if (/zepam|zolpidem|sertraline|citalopram|escitalopram|venlafaxine|haloperidol|ziprasidone|lithium|topiramate|lamotrigine|phenytoin|carbamazepine/.test(s)) return "CNS / psychiatric";
    if (/ondansetron|granisetron|palonosetron|pantoprazole|omeprazole|esomeprazole|famotidine|mesalamine|lansoprazole/.test(s)) return "GI";
    return "Medication";
  }

  function loadAllMedicationInventory() {
    const h = H();
    if (!h || h.__allSaundersLoaded) return;
    const rows = ROWS.split("~").map(r => r.split("|")).filter(r => r[0] && r[1] && !/^(mg|ml-min|e|with-|combination-|dmmr-|chl-)/i.test(r[0]));
    const seen = new Set(h.items.map(x => x.id));
    rows.forEach((r, i) => { if (!seen.has(r[0])) { h.items.push(makeItem(r, i)); seen.add(r[0]); } });
    h.items.sort((a, b) => String(a.generic || a.name).localeCompare(String(b.generic || b.name)));
    h.__allSaundersLoaded = true;
  }

  function label(item) { return item ? `${item.generic || item.name}${item.brand ? " (" + item.brand + ")" : ""}` : ""; }
  function optionsForAmount(item, max) {
    const unit = item?.unit || unitFor(item?.name);
    const ceiling = Math.max(1, Math.min(Number(max || item?.onHand || item?.qty || 20), 30));
    return Array.from({ length: ceiling }, (_, i) => `<option value="${i + 1}">${i + 1} ${esc(unit)}</option>`).join("");
  }

  function seedStorage() {
    loadAllMedicationInventory();
    const h = H(); if (!h) return;
    KEYS.forEach(key => {
      const s = parse(key) || {};
      if (key === "hct_his_v1") {
        s.inventory = s.inventory || {}; s.inventory.pharmacy = Array.isArray(s.inventory.pharmacy) ? s.inventory.pharmacy : [];
        h.items.forEach((item, i) => mergeOffline(s.inventory.pharmacy, item, i));
      } else if (key === "hct_his_online_mode_v1") {
        s.stock = Array.isArray(s.stock) ? s.stock : [];
        h.items.forEach((item, i) => mergeV1(s.stock, item, i));
      } else {
        s.stock = s.stock && typeof s.stock === "object" ? s.stock : {};
        h.items.forEach((item, i) => mergeV2(s.stock, item, i));
      }
      save(key, s);
    });
  }

  function stockShape(item, i) { return { id: item.id, name: item.name, generic: item.generic || item.name, brand: item.brand || "", onHand: item.onHand || item.qty || (24 + i % 30), qty: item.qty || item.onHand || (24 + i % 30), par: item.par || 8, cat: item.category, category: item.category, aliases: item.aliases, unit: item.unit || unitFor(item.name), doses: doseFor(item), availability: item.availability, handbookId: item.id }; }
  function mergeOffline(list, item, i) { const s = stockShape(item, i); const x = list.find(v => v.id === s.id || v.name === s.name); if (x) Object.assign(x, s, { requested: Number(x.requested || 0) }); else list.push(Object.assign(s, { requested: 0 })); }
  function mergeV1(list, item, i) { const s = stockShape(item, i); const x = list.find(v => v.id === s.id || v.name === s.name); if (x) Object.assign(x, s); else list.push(s); }
  function mergeV2(stock, item, i) { const s = stockShape(item, i); stock[s.id] = Object.assign(stock[s.id] || {}, s); }

  function enhanceMedicationControls() {
    loadAllMedicationInventory();
    const h = H(); if (!h) return;
    ["m-id", "hisx-med", "his-med-item", "fx-med-id"].forEach(id => {
      const el = document.getElementById(id); if (!el || el.dataset.fullInventory) return;
      const selected = el.value;
      el.innerHTML = h.items.map(item => `<option value="${esc(item.id)}"${item.id === selected ? " selected" : ""}>${esc(label(item))}</option>`).join("");
      el.dataset.fullInventory = "1";
    });
    wirePair("m-id", "m-dose", "m-qty");
    wirePair("hisx-med", "hisx-dose", "hisx-qty");
    wirePair("his-med-item", "his-med-dose", "his-med-qty");
    wirePair("fx-med-id", "fx-med-dose", "fx-med-qty");
    annotateRows();
  }

  function wirePair(medId, doseId, qtyId) {
    const h = H(), med = document.getElementById(medId); if (!h || !med) return;
    let dose = document.getElementById(doseId);
    if (dose && dose.tagName !== "SELECT") { const s = document.createElement("select"); s.id = doseId; s.className = "drug-dose-select"; dose.replaceWith(s); dose = s; }
    let qty = document.getElementById(qtyId);
    if (!qty && dose) { qty = document.createElement("select"); qty.id = qtyId; qty.className = "drug-dose-select"; dose.insertAdjacentElement("afterend", qty); }
    if (qty && qty.tagName !== "SELECT") { const s = document.createElement("select"); s.id = qtyId; s.className = "drug-dose-select"; qty.replaceWith(s); qty = s; }
    const sync = () => { const item = h.find(med.value); if (dose && item) dose.innerHTML = h.doseOptions(item); if (qty && item) qty.innerHTML = optionsForAmount(item, item.qty || item.onHand); };
    if (!med.dataset.amountBound) { med.dataset.amountBound = "1"; med.addEventListener("change", sync); }
    sync();
  }

  function annotateRows() {
    const h = H(); if (!h) return;
    document.querySelectorAll(".his-table td strong,.hisx-table td strong,.hisx-row strong,.hisx-stock b,.hisx-list li b").forEach(el => {
      if (el.dataset.medLabeled) return;
      const item = h.find(el.textContent || ""); if (!item) return;
      el.textContent = label(item); el.dataset.medLabeled = "1";
      if (!el.parentElement.querySelector(".drug-info-btn")) el.insertAdjacentHTML("afterend", ` <button class="drug-info-btn" data-med-info="${esc(item.id)}">Drug guide</button>`);
    });
    h.bindDrugCards(document);
  }

  function interceptGive(e) {
    const btn = e.target.closest && (e.target.closest("[data-hisx-give]") || e.target.closest('[data-med-action="given"]') || e.target.closest('[data-fx-med="given"]') || e.target.closest("[data-his-give-med]"));
    if (!btn || btn.dataset.giveEnhanced) return;
    e.preventDefault(); e.stopImmediatePropagation(); btn.dataset.giveEnhanced = "1";
    const amount = prompt("Amount actually given (number only):", "1");
    if (!amount) { btn.dataset.giveEnhanced = ""; return; }
    const unit = prompt("Unit given (mL, tablet(s), capsule(s), puff(s), unit(s)):", "mL") || "unit(s)";
    const dose = prompt("Dose administered:", btn.closest("tr,.hisx-row,li")?.textContent?.match(/\d+\s*(mg|mcg|g|mL|units?)/i)?.[0] || "Dose per order") || "Dose per order";
    storeGive(btn, dose, amount, unit);
    btn.click();
  }

  function storeGive(btn, dose, amount, unit) {
    const ids = [btn.dataset.hisxGive, btn.dataset.medId, btn.dataset.hisGiveMed].filter(Boolean);
    KEYS.forEach(key => {
      const s = parse(key); if (!s) return;
      const patients = key === "hct_his_online_mode_v2" ? Object.values(s.patients || {}) : key === "hct_his_online_mode_v1" ? Object.values(s.patients || {}) : [];
      patients.forEach(p => (p.meds || p.medRequests || []).forEach(m => { if (ids.includes(m.id)) Object.assign(m, { givenDose: dose, givenAmount: Number(amount), givenUnit: unit, givenBy: who(), givenAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }); }));
      save(key, s);
    });
  }

  function connectLive() {
    try { bc = bc || new BroadcastChannel(channelName); bc.onmessage = e => applyRemote(e.data); } catch (_) {}
    try {
      if (!live && window.cloud?.client?.channel) {
        live = cloud.client.channel(channelName, { config: { broadcast: { ack: false } } });
        live.on("broadcast", { event: "state" }, e => applyRemote(e.payload));
        live.subscribe();
      }
    } catch (_) {}
    window.addEventListener("storage", e => { if (KEYS.includes(e.key)) schedulePublish(e.key); });
  }

  function schedulePublish(key) { clearTimeout(publishTimer); publishTimer = setTimeout(() => publishKey(key), 180); }
  function publishKey(key) {
    if (applying) return;
    const payload = { cid: clientId, key, state: parse(key), sentAt: Date.now() };
    try { bc && bc.postMessage(payload); } catch (_) {}
    try { live && live.send({ type: "broadcast", event: "state", payload }); } catch (_) {}
  }

  function applyRemote(msg) {
    if (!msg || msg.cid === clientId || !KEYS.includes(msg.key) || !msg.state) return;
    applying = true;
    const local = parse(msg.key) || {};
    const merged = mergeState(local, msg.state, msg.key);
    save(msg.key, merged);
    applying = false;
    showNewNotification(merged);
    if (typeof window.render === "function") setTimeout(() => window.render(), 80);
  }

  function mergeState(a, b, key) {
    if (key === "hct_his_online_mode_v2") return Object.assign({}, a, b, { patients: Object.assign({}, a.patients || {}, b.patients || {}), events: mergeEvents(a.events, b.events), stock: Object.assign({}, a.stock || {}, b.stock || {}) });
    if (key === "hct_his_online_mode_v1") return Object.assign({}, a, b, { patients: Object.assign({}, a.patients || {}, b.patients || {}), events: mergeEvents(a.events, b.events), stock: mergeStock(a.stock, b.stock) });
    return Object.assign({}, a, b, { inventory: b.inventory || a.inventory, supplyRequests: mergeEvents(a.supplyRequests, b.supplyRequests) });
  }
  function mergeEvents(a = [], b = []) { const seen = new Set(), out = []; [...b, ...a].forEach(x => { const k = `${x.stamp || x.time}|${x.dept || ""}|${x.text || x.item || ""}|${x.patient || ""}`; if (!seen.has(k)) { seen.add(k); out.push(x); } }); return out.slice(0, 180); }
  function mergeStock(a = [], b = []) { const m = new Map(); [...a, ...b].forEach(x => m.set(x.id, Object.assign(m.get(x.id) || {}, x))); return [...m.values()]; }

  function showNewNotification(state) {
    const ev = (state.events || [])[0]; if (!ev) return;
    const stamp = ev.stamp || ev.time || ev.text; if (!stamp || stamp === lastEventStamp) return;
    lastEventStamp = stamp; localStorage.hct_med_last_event = stamp;
    let host = document.getElementById("hisx-popups"); if (!host) { host = document.createElement("div"); host.id = "hisx-popups"; document.body.appendChild(host); }
    const note = document.createElement("div"); note.className = "hisx-popup"; note.innerHTML = `<strong>${esc(ev.dept || "Live update")}</strong><span>${esc([ev.text, ev.patient].filter(Boolean).join(" - "))}</span>`; host.appendChild(note);
    setTimeout(() => note.classList.add("fade"), 4500); setTimeout(() => note.remove(), 5400);
  }

  function enhanceSoon() { clearTimeout(enhanceTimer); enhanceTimer = setTimeout(enhanceMedicationControls, 120); }
  seedStorage(); connectLive(); document.addEventListener("click", interceptGive, true);
  document.addEventListener("DOMContentLoaded", enhanceSoon);
  new MutationObserver(enhanceSoon).observe(document.documentElement, { childList: true, subtree: true });
})();
