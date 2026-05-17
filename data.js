window.DATA = {
  "headline": {
    "n_canonical": 13,
    "n_total": 15,
    "n_main_cells": 6,
    "n_sign_shuffle_reject": 5,
    "n_cancellers_total": 27,
    "n_writers_total": 54,
    "n_artefacts_ruled_out": 6,
    "fv_overlap_hier_W": 4,
    "fv_overlap_hier_C": 64,
    "fv_overlap_mod_W": 59,
    "fv_overlap_mod_C": 8,
    "n_content_driven": 20,
    "ablation_logit_min": 0.13,
    "ablation_logit_max": 0.29,
    "ablation_acc_min": 2,
    "ablation_acc_max": 7,
    "l11h4_v_shuffle_hier_pct": 82,
    "l11h4_v_shuffle_mod_pct": 53,
    "l11h4_ov_top1_pct": 2.8
  },
  "mainCells": [
    {
      "id": "hier-410M",
      "src": "hierarchical_410m",
      "task": "hier",
      "size": "410M",
      "scale_b": 0.41
    },
    {
      "id": "hier-1B",
      "src": "hierarchical_1b",
      "task": "hier",
      "size": "1B",
      "scale_b": 1.0
    },
    {
      "id": "hier-1.4B",
      "src": "hierarchical_1.4b",
      "task": "hier",
      "size": "1.4B",
      "scale_b": 1.4
    },
    {
      "id": "mod-410M",
      "src": "modular_410m",
      "task": "mod",
      "size": "410M",
      "scale_b": 0.41
    },
    {
      "id": "mod-1B",
      "src": "modular_1b",
      "task": "mod",
      "size": "1B",
      "scale_b": 1.0
    },
    {
      "id": "mod-1.4B",
      "src": "modular_1.4b",
      "task": "mod",
      "size": "1.4B",
      "scale_b": 1.4
    }
  ],
  "extensionCells": [
    {
      "id": "hier-2.8B",
      "src": "pythia-2.8b_hierarchical",
      "task": "hier",
      "size": "2.8B",
      "family": "Pythia",
      "verdict": "canonical"
    },
    {
      "id": "mod-2.8B",
      "src": "pythia-2.8b_modular",
      "task": "mod",
      "size": "2.8B",
      "family": "Pythia",
      "verdict": "canonical"
    },
    {
      "id": "hier-6.9B",
      "src": "pythia-6.9b_hierarchical",
      "task": "hier",
      "size": "6.9B",
      "family": "Pythia",
      "verdict": "canonical"
    },
    {
      "id": "mod-6.9B",
      "src": "pythia-6.9b_modular",
      "task": "mod",
      "size": "6.9B",
      "family": "Pythia",
      "verdict": "partial"
    },
    {
      "id": "hier-12B",
      "src": "pythia-12b_hierarchical",
      "task": "hier",
      "size": "12B",
      "family": "Pythia",
      "verdict": "partial"
    },
    {
      "id": "mod-12B",
      "src": "pythia-12b_modular",
      "task": "mod",
      "size": "12B",
      "family": "Pythia",
      "verdict": "canonical"
    },
    {
      "id": "mod-Qwen1.5B",
      "src": "Qwen/Qwen2.5-1.5B",
      "task": "mod",
      "size": "1.5B",
      "family": "Qwen2.5",
      "verdict": "canonical"
    },
    {
      "id": "mod-Qwen7B",
      "src": "Qwen/Qwen2.5-7B",
      "task": "mod",
      "size": "7B",
      "family": "Qwen2.5",
      "verdict": "canonical"
    },
    {
      "id": "mod-GPT2-M",
      "src": "gpt2-medium",
      "task": "mod",
      "size": "355M",
      "family": "GPT-2-medium",
      "verdict": "canonical"
    }
  ],
  "groupLesion": {
    "hier-410M": {
      "n_writers": 8,
      "n_cancellers": 6,
      "n_union": 14,
      "baseline_acc": 0.546,
      "zero": {
        "W_shift": -0.24830356788635255,
        "W_ci": [
          -0.323405180644989,
          -0.17454981894493105
        ],
        "C_shift": 0.287680850982666,
        "C_ci": [
          0.2000617235183716,
          0.3757690559387207
        ],
        "both_shift": 0.0016093692779541016,
        "both_ci": [
          -0.06822427000999451,
          0.071488375711441
        ],
        "attenuated": true
      },
      "mean": {
        "W_shift": -0.3427746772766113,
        "C_shift": 0.2903301830291748,
        "both_shift": -0.1720238265991211
      }
    },
    "hier-1B": {
      "n_writers": 9,
      "n_cancellers": 4,
      "n_union": 13,
      "baseline_acc": 0.576,
      "zero": {
        "W_shift": -0.557847469329834,
        "W_ci": [
          -0.7433854124546051,
          -0.3691340378761292
        ],
        "C_shift": 0.15963270568847657,
        "C_ci": [
          0.1187555459022522,
          0.20065901751518248
        ],
        "both_shift": -0.4302825756072998,
        "both_ci": [
          -0.5952220980644226,
          -0.2638902390480042
        ],
        "attenuated": true
      },
      "mean": {
        "W_shift": -0.44391880607604983,
        "C_shift": 0.27586166954040525,
        "both_shift": -0.3372531433105469
      }
    },
    "hier-1.4B": {
      "n_writers": 10,
      "n_cancellers": 4,
      "n_union": 14,
      "baseline_acc": 0.608,
      "zero": {
        "W_shift": -0.3208725929260254,
        "W_ci": [
          -0.41305263009071347,
          -0.2268098430633545
        ],
        "C_shift": 0.1502163486480713,
        "C_ci": [
          0.09411319875717164,
          0.20580473928451537
        ],
        "both_shift": -0.12801883125305175,
        "both_ci": [
          -0.19493495478630066,
          -0.058676130342483535
        ],
        "attenuated": true
      },
      "mean": {
        "W_shift": -0.37002781867980955,
        "C_shift": 0.22416022300720215,
        "both_shift": -0.23595640563964843
      }
    },
    "mod-410M": {
      "n_writers": 8,
      "n_cancellers": 3,
      "n_union": 11,
      "baseline_acc": 0.556,
      "zero": {
        "W_shift": -0.3909177188873291,
        "W_ci": [
          -0.5312156045913696,
          -0.25173279199600235
        ],
        "C_shift": 0.1649371395111084,
        "C_ci": [
          0.11860654344558716,
          0.2119539598464966
        ],
        "both_shift": -0.14446056365966797,
        "both_ci": [
          -0.2619434269428253,
          -0.025470924615860056
        ],
        "attenuated": true
      },
      "mean": {
        "W_shift": -0.31217136192321776,
        "C_shift": 0.12476764297485352,
        "both_shift": -0.23204624557495118
      }
    },
    "mod-1B": {
      "n_writers": 8,
      "n_cancellers": 6,
      "n_union": 14,
      "baseline_acc": 0.546,
      "zero": {
        "W_shift": -0.9925075473785401,
        "W_ci": [
          -1.2109905911445618,
          -0.7658158104419709
        ],
        "C_shift": 0.20580977249145507,
        "C_ci": [
          0.12850770716667176,
          0.28260785474777217
        ],
        "both_shift": -0.784366226196289,
        "both_ci": [
          -0.9655208258152008,
          -0.5990752847671509
        ],
        "attenuated": true
      },
      "mean": {
        "W_shift": -0.40025435638427737,
        "C_shift": 0.2629278717041016,
        "both_shift": -0.25357249641418456
      }
    },
    "mod-1.4B": {
      "n_writers": 11,
      "n_cancellers": 4,
      "n_union": 15,
      "baseline_acc": 0.562,
      "zero": {
        "W_shift": -0.4855941581726074,
        "W_ci": [
          -0.617527747631073,
          -0.3539440106868744
        ],
        "C_shift": 0.1295967216491699,
        "C_ci": [
          0.08917825736999511,
          0.17048003659248354
        ],
        "both_shift": -0.3753801155090332,
        "both_ci": [
          -0.46709779272079466,
          -0.2815964892864227
        ],
        "attenuated": true
      },
      "mean": {
        "W_shift": -0.3481576519012451,
        "C_shift": 0.09329452896118164,
        "both_shift": -0.2548467426300049
      }
    }
  },
  "signShuffle": {
    "hier-410M": {
      "observed": -0.4348140754699707,
      "null_p05": -0.26674560546875004,
      "null_p50": -0.007907562255859375,
      "null_p95": 0.23667548847198447,
      "null_mean": -0.009771572826766968,
      "null_std": 0.15224067182392284,
      "p_emp": 0.0024,
      "p_gauss": null,
      "rejects": true
    },
    "hier-1B": {
      "observed": -0.6071373252868653,
      "null_p05": -0.43645317382812476,
      "null_p50": -0.09953945922851562,
      "null_p95": 0.23539633560180664,
      "null_mean": -0.10014436272125245,
      "null_std": 0.20511263320432813,
      "p_emp": 0.0047,
      "p_gauss": null,
      "rejects": true
    },
    "hier-1.4B": {
      "observed": -0.2745473403930664,
      "null_p05": -0.2023544807434082,
      "null_p50": -0.04212681198120117,
      "null_p95": 0.12845215988159178,
      "null_mean": -0.04158760221061707,
      "null_std": 0.10047355594092312,
      "p_emp": 0.0035,
      "p_gauss": null,
      "rejects": true
    },
    "mod-410M": {
      "observed": -0.3607531795501709,
      "null_p05": -0.3153478298187256,
      "null_p50": -0.04260606956481934,
      "null_p95": 0.1678649616241455,
      "null_mean": -0.04485652953071594,
      "null_std": 0.15156305055800082,
      "p_emp": 0.0116,
      "p_gauss": null,
      "rejects": true
    },
    "mod-1B": {
      "observed": -0.6827787418365479,
      "null_p05": -0.4074436426162719,
      "null_p50": -0.02806526374816895,
      "null_p95": 0.3464552021026611,
      "null_mean": -0.029950684968566895,
      "null_std": 0.22773258172455793,
      "p_emp": 0.001,
      "p_gauss": null,
      "rejects": true
    },
    "mod-1.4B": {
      "observed": -0.2233475112915039,
      "null_p05": -0.22997175216674803,
      "null_p50": 0.01263471221923828,
      "null_p95": 0.21677917861938478,
      "null_mean": 0.005460056942367553,
      "null_std": 0.1340469514410981,
      "p_emp": 0.104,
      "p_gauss": null,
      "rejects": false
    }
  },
  "qkSource": {
    "hier-410M": {
      "writer": {
        "BOS": 0.34833476851827827,
        "format_prefix": 0.035941447194761174,
        "demo_input": 0.13581318170949053,
        "demo_label": 0.4609480647686876,
        "query_input": 0.01896253780878255
      },
      "canceller": {
        "BOS": 0.344689416287087,
        "format_prefix": 0.14787100448488788,
        "demo_input": 0.10540342951160923,
        "demo_label": 0.3322458221486367,
        "query_input": 0.06979032756777921
      },
      "n_writers": 8,
      "n_cancellers": 6
    },
    "hier-1B": {
      "writer": {
        "BOS": 0.4107484090197392,
        "format_prefix": 0.11128538024938031,
        "demo_input": 0.09437408093071929,
        "demo_label": 0.3525507667000986,
        "query_input": 0.03104136310006257
      },
      "canceller": {
        "BOS": 0.4351494993032188,
        "format_prefix": 0.29145625301402794,
        "demo_input": 0.05663035048411944,
        "demo_label": 0.1817745177626266,
        "query_input": 0.03498937943600718
      },
      "n_writers": 9,
      "n_cancellers": 4
    },
    "hier-1.4B": {
      "writer": {
        "BOS": 0.2841016277568936,
        "format_prefix": 0.12677684832023192,
        "demo_input": 0.05472411688718966,
        "demo_label": 0.5179318280784323,
        "query_input": 0.0164655789572525
      },
      "canceller": {
        "BOS": 0.2654782325906514,
        "format_prefix": 0.2569436734037928,
        "demo_input": 0.0605706480403273,
        "demo_label": 0.3708527440043622,
        "query_input": 0.04615470196086633
      },
      "n_writers": 10,
      "n_cancellers": 4
    },
    "mod-410M": {
      "writer": {
        "BOS": 0.33875200362963864,
        "format_prefix": 0.1698644579459975,
        "demo_input": 0.10796649893226837,
        "demo_label": 0.3592799076467776,
        "query_input": 0.024137131845317787
      },
      "canceller": {
        "BOS": 0.3846408090764264,
        "format_prefix": 0.25818651794701014,
        "demo_input": 0.06414729420279423,
        "demo_label": 0.24304695790889963,
        "query_input": 0.049978420864869595
      },
      "n_writers": 8,
      "n_cancellers": 3
    },
    "mod-1B": {
      "writer": {
        "BOS": 0.4395328645106608,
        "format_prefix": 0.12491288285897419,
        "demo_input": 0.07153282212723074,
        "demo_label": 0.3359104253114131,
        "query_input": 0.028111005191721196
      },
      "canceller": {
        "BOS": 0.45842252801165045,
        "format_prefix": 0.195157803982606,
        "demo_input": 0.06779363208509835,
        "demo_label": 0.2178550247702436,
        "query_input": 0.06077101115040159
      },
      "n_writers": 8,
      "n_cancellers": 6
    },
    "mod-1.4B": {
      "writer": {
        "BOS": 0.3245601661379432,
        "format_prefix": 0.13387180341991808,
        "demo_input": 0.06495352950115545,
        "demo_label": 0.4504718084338867,
        "query_input": 0.02614269250709663
      },
      "canceller": {
        "BOS": 0.2484994789029607,
        "format_prefix": 0.2538902914567138,
        "demo_input": 0.07398029644605447,
        "demo_label": 0.36404915431580886,
        "query_input": 0.059580778878462165
      },
      "n_writers": 11,
      "n_cancellers": 4
    }
  },
  "perSourceDLA": {
    "hier-410M": [
      {
        "head": "L11.H4",
        "total": -0.21551659010350704,
        "content_share": 1.0061077924106319,
        "sink_share": -0.006107784558773085,
        "is_content_driven": true
      },
      {
        "head": "L19.H15",
        "total": -0.04934777225367725,
        "content_share": 1.006438271298155,
        "sink_share": -0.006438251751337768,
        "is_content_driven": true
      },
      {
        "head": "L12.H0",
        "total": -0.03993519753450528,
        "content_share": 1.0061304522912566,
        "sink_share": -0.006130446894211896,
        "is_content_driven": true
      },
      {
        "head": "L10.H8",
        "total": -0.03918170450255275,
        "content_share": 1.0494262787875501,
        "sink_share": -0.049426290995209454,
        "is_content_driven": true
      },
      {
        "head": "L13.H1",
        "total": -0.039143707491457465,
        "content_share": 0.9366212885031189,
        "sink_share": 0.06337871282184324,
        "is_content_driven": true
      },
      {
        "head": "L14.H3",
        "total": -0.033061694401840216,
        "content_share": -0.015174869268927856,
        "sink_share": 1.0151748683548307,
        "is_content_driven": false
      }
    ],
    "hier-1B": [
      {
        "head": "L13.H1",
        "total": -0.15867284867912532,
        "content_share": 1.0108194312691823,
        "sink_share": -0.010819446547295448,
        "is_content_driven": true
      },
      {
        "head": "L10.H2",
        "total": -0.09384411357808858,
        "content_share": 0.014642998985927778,
        "sink_share": 0.9853569982241785,
        "is_content_driven": false
      },
      {
        "head": "L12.H5",
        "total": -0.03887075473088771,
        "content_share": -0.06043572469658991,
        "sink_share": 1.0604357170604457,
        "is_content_driven": false
      },
      {
        "head": "L11.H6",
        "total": 0.006793560159858316,
        "content_share": 1.0459921183755956,
        "sink_share": -0.045992037499761496,
        "is_content_driven": true
      }
    ],
    "hier-1.4B": [
      {
        "head": "L12.H7",
        "total": -0.1523255743458867,
        "content_share": 1.0028839975017305,
        "sink_share": -0.0028839742938206216,
        "is_content_driven": true
      },
      {
        "head": "L10.H7",
        "total": -0.11887829016894103,
        "content_share": 1.0301799159111094,
        "sink_share": -0.030179902293777976,
        "is_content_driven": true
      },
      {
        "head": "L11.H2",
        "total": -0.04447742704534903,
        "content_share": -0.013700121183288201,
        "sink_share": 1.0137001307900941,
        "is_content_driven": false
      },
      {
        "head": "L12.H0",
        "total": 0.01702806190121919,
        "content_share": 0.9263980124896267,
        "sink_share": 0.07360197852161475,
        "is_content_driven": true
      }
    ],
    "mod-410M": [
      {
        "head": "L11.H4",
        "total": -0.21531174141913653,
        "content_share": 1.013598416417311,
        "sink_share": -0.013598397553801824,
        "is_content_driven": true
      },
      {
        "head": "L12.H0",
        "total": -0.041365151554346086,
        "content_share": 1.0072118770919936,
        "sink_share": -0.007211854398023649,
        "is_content_driven": true
      },
      {
        "head": "L14.H3",
        "total": -0.019467519059544428,
        "content_share": -0.026809835888162114,
        "sink_share": 1.0268098814116107,
        "is_content_driven": false
      }
    ],
    "mod-1B": [
      {
        "head": "L13.H1",
        "total": -0.13801524226553738,
        "content_share": 1.0163882418881063,
        "sink_share": -0.01638822909507058,
        "is_content_driven": true
      },
      {
        "head": "L12.H1",
        "total": -0.05750323638319969,
        "content_share": 0.9953589986355773,
        "sink_share": 0.004641022314996055,
        "is_content_driven": true
      },
      {
        "head": "L8.H7",
        "total": -0.05576582416426391,
        "content_share": 0.9236250762366455,
        "sink_share": 0.0763749291160264,
        "is_content_driven": true
      },
      {
        "head": "L10.H2",
        "total": -0.024415396070107818,
        "content_share": 0.05375419393786249,
        "sink_share": 0.946245801779708,
        "is_content_driven": false
      },
      {
        "head": "L12.H4",
        "total": -0.01910832092165947,
        "content_share": 1.2132384433914971,
        "sink_share": -0.2132384754736363,
        "is_content_driven": true
      },
      {
        "head": "L11.H6",
        "total": 0.062497639746870844,
        "content_share": 1.0267506535716557,
        "sink_share": -0.026750651284008112,
        "is_content_driven": true
      }
    ],
    "mod-1.4B": [
      {
        "head": "L10.H7",
        "total": -0.1445297137647867,
        "content_share": 1.0280352498977217,
        "sink_share": -0.028035255266507093,
        "is_content_driven": true
      },
      {
        "head": "L13.H2",
        "total": -0.02723031587898731,
        "content_share": 1.0450045616818158,
        "sink_share": -0.045004657931073985,
        "is_content_driven": true
      },
      {
        "head": "L11.H2",
        "total": 0.0025271809892728923,
        "content_share": 0.3951727215551079,
        "sink_share": 0.6048277151924133,
        "is_content_driven": false
      },
      {
        "head": "L12.H0",
        "total": 0.01571370760910213,
        "content_share": 0.9683006721654539,
        "sink_share": 0.03169924259778376,
        "is_content_driven": true
      }
    ]
  },
  "fvOverlap": {
    "hier": {
      "hier-410M": {
        "n_writers": 8,
        "n_cancellers": 6,
        "w_in_top20": 0,
        "c_in_top20": 2
      },
      "hier-1B": {
        "n_writers": 9,
        "n_cancellers": 4,
        "w_in_top20": 1,
        "c_in_top20": 4
      },
      "hier-1.4B": {
        "n_writers": 10,
        "n_cancellers": 4,
        "w_in_top20": 0,
        "c_in_top20": 3
      }
    },
    "mod": {
      "mod-410M": {
        "n_writers": 8,
        "n_cancellers": 3,
        "w_in_top20": 5,
        "c_in_top20": 0
      },
      "mod-1B": {
        "n_writers": 8,
        "n_cancellers": 6,
        "w_in_top20": 5,
        "c_in_top20": 0
      },
      "mod-1.4B": {
        "n_writers": 11,
        "n_cancellers": 4,
        "w_in_top20": 6,
        "c_in_top20": 1
      }
    }
  },
  "fvOverlapPooled": {
    "hier": {
      "n_writers": 27,
      "n_cancellers": 14,
      "w_in_top20": 1,
      "c_in_top20": 9,
      "writers_frac": 0.037037037037037035,
      "cancellers_frac": 0.6428571428571429
    },
    "mod": {
      "n_writers": 27,
      "n_cancellers": 13,
      "w_in_top20": 16,
      "c_in_top20": 1,
      "writers_frac": 0.5925925925925926,
      "cancellers_frac": 0.07692307692307693
    }
  },
  "ablationAccuracy": {
    "hier-410M": {
      "baseline_acc": 0.546,
      "C": {
        "ci_95": [
          0.006964317245585994,
          0.1290356827544139
        ],
        "delta_acc": 0.06799999999999995,
        "logit_shift": 0.2876802864074707
      },
      "W": {
        "ci_95": [
          -0.1138459795130602,
          0.009845979513060113
        ],
        "delta_acc": -0.052000000000000046,
        "logit_shift": -0.24830281829833983
      },
      "both": {
        "ci_95": [
          -0.03148841545094734,
          0.09148841545094717
        ],
        "delta_acc": 0.029999999999999916,
        "logit_shift": 0.0016028690338134766
      }
    },
    "hier-1B": {
      "baseline_acc": 0.576,
      "C": {
        "ci_95": [
          -0.03699387765984043,
          0.08499387765984047
        ],
        "delta_acc": 0.02400000000000002,
        "logit_shift": 0.15963270568847657
      },
      "W": {
        "ci_95": [
          -0.22117901291717468,
          -0.09882098708282526
        ],
        "delta_acc": -0.15999999999999998,
        "logit_shift": -0.557847469329834
      },
      "both": {
        "ci_95": [
          -0.18149965983518715,
          -0.058500340164812724
        ],
        "delta_acc": -0.11999999999999994,
        "logit_shift": -0.4302825756072998
      }
    },
    "hier-1.4B": {
      "baseline_acc": 0.608,
      "C": {
        "ci_95": [
          -0.013746440852504378,
          0.10574644085250445
        ],
        "delta_acc": 0.04600000000000004,
        "logit_shift": 0.1502163486480713
      },
      "W": {
        "ci_95": [
          -0.13317097520934032,
          -0.010829024790659593
        ],
        "delta_acc": -0.07199999999999995,
        "logit_shift": -0.3208725929260254
      },
      "both": {
        "ci_95": [
          -0.06457018104740746,
          0.05657018104740745
        ],
        "delta_acc": -0.0040000000000000036,
        "logit_shift": -0.12801883125305175
      }
    },
    "mod-410M": {
      "baseline_acc": 0.556,
      "C": {
        "ci_95": [
          -0.02727914456057213,
          0.09527914456057196
        ],
        "delta_acc": 0.03399999999999992,
        "logit_shift": 0.16493333053588868
      },
      "W": {
        "ci_95": [
          -0.06964141261136844,
          0.053641412611368434
        ],
        "delta_acc": -0.008000000000000007,
        "logit_shift": -0.3909241580963135
      },
      "both": {
        "ci_95": [
          0.023446057063148014,
          0.14455394293685192
        ],
        "delta_acc": 0.08399999999999996,
        "logit_shift": -0.14446608734130859
      }
    },
    "mod-1B": {
      "baseline_acc": 0.546,
      "C": {
        "ci_95": [
          -0.025429161061699873,
          0.09742916106169972
        ],
        "delta_acc": 0.03599999999999992,
        "logit_shift": 0.20580977249145507
      },
      "W": {
        "ci_95": [
          -0.2936125551024927,
          -0.1743874448975074
        ],
        "delta_acc": -0.23400000000000004,
        "logit_shift": -0.9925075473785401
      },
      "both": {
        "ci_95": [
          -0.221035682754414,
          -0.09896431724558608
        ],
        "delta_acc": -0.16000000000000003,
        "logit_shift": -0.784366226196289
      }
    },
    "mod-1.4B": {
      "baseline_acc": 0.562,
      "C": {
        "ci_95": [
          -0.025140321754573272,
          0.09714032175457311
        ],
        "delta_acc": 0.03599999999999992,
        "logit_shift": 0.1295967216491699
      },
      "W": {
        "ci_95": [
          -0.06754536583332035,
          0.055545365833320336
        ],
        "delta_acc": -0.006000000000000005,
        "logit_shift": -0.4855941581726074
      },
      "both": {
        "ci_95": [
          -0.11973979882214043,
          0.0037397988221403305
        ],
        "delta_acc": -0.05800000000000005,
        "logit_shift": -0.3753801155090332
      }
    }
  },
  "l11h4": {
    "v_shuffle_hier": {
      "baseline_dla": -0.2155165925901383,
      "shuffled_dla": -0.03954079240405311,
      "diff_mean": 0.17597580018608522,
      "diff_ci": [
        0.07957371545237645,
        0.2789776336209227
      ],
      "interpretation": "CONTENT-DRIVEN: V-shuffle destroys negative DLA"
    },
    "v_compose_hier": {
      "baseline_dla": -0.2155165925901383,
      "killed_dla": null,
      "diff_mean": 0.006559704355895519,
      "diff_ci": [
        -0.0012196063697338104,
        0.014544927349779746
      ]
    },
    "v_shuffle_mod": {
      "baseline_dla": -0.21531174163566902,
      "shuffled_dla": -0.10272984174235414,
      "diff_mean": 0.11258189989331488,
      "diff_ci": [
        0.015182386842614495,
        0.205906865614544
      ],
      "interpretation": "CONTENT-DRIVEN: V-shuffle destroys negative DLA"
    },
    "v_compose_mod": {
      "baseline_dla": -0.21531174163566902,
      "killed_dla": null,
      "diff_mean": 0.004576628694776446,
      "diff_ci": [
        -0.002108738295268267,
        0.011025046559458131
      ]
    },
    "ov_spectrum": {
      "top1_share": 0.027712173759937286,
      "top5_share": 0.13224785029888153,
      "top10_share": 0.24834321439266205,
      "shares": [
        0.027712175077037528,
        0.027120993243083022,
        0.026580364759835058,
        0.025765997501733588,
        0.025068318889576207,
        0.024218560056401064,
        0.023323105315735847,
        0.02314102412902093,
        0.022791921615936538,
        0.022620762734486898,
        0.02208269450051255,
        0.02185848695425598,
        0.021452314290164243,
        0.021220215585910928,
        0.021000088396300343
      ],
      "modes": [
        {
          "mode": 0,
          "sigma": 1.2710881233215332,
          "cos": -0.12728026509284973,
          "signed": -0.16178443329273762
        },
        {
          "mode": 1,
          "sigma": 1.2574570178985596,
          "cos": 0.028250813484191895,
          "signed": 0.035524183677040355
        },
        {
          "mode": 2,
          "sigma": 1.2448608875274658,
          "cos": 0.005247442051768303,
          "signed": 0.006532335369813236
        },
        {
          "mode": 3,
          "sigma": 1.2256425619125366,
          "cos": 0.07414966821670532,
          "signed": 0.0908809893180873
        },
        {
          "mode": 4,
          "sigma": 1.208935022354126,
          "cos": -0.003461955115199089,
          "signed": -0.0041852787845821915
        },
        {
          "mode": 5,
          "sigma": 1.1882683038711548,
          "cos": -0.0015950687229633331,
          "signed": -0.0018953696059935687
        },
        {
          "mode": 6,
          "sigma": 1.1660939455032349,
          "cos": 0.024594824761152267,
          "signed": 0.028679876244692704
        },
        {
          "mode": 7,
          "sigma": 1.161533236503601,
          "cos": -0.014171475544571877,
          "signed": -0.016460639855318204
        },
        {
          "mode": 8,
          "sigma": 1.1527385711669922,
          "cos": 0.029380209743976593,
          "signed": 0.03386770100085812
        },
        {
          "mode": 9,
          "sigma": 1.1484020948410034,
          "cos": -0.043125271797180176,
          "signed": -0.04952515247246936
        }
      ],
      "frob_norm": 7.635550498962402
    }
  },
  "l11h4CrossTemplate": {
    "hier": {
      "shift": 0.2155165925901383,
      "ci": [
        0.12152768061049468,
        0.30950550456978193
      ],
      "role": "canceller"
    },
    "mod": {
      "shift": 0.21531174163566902,
      "ci": [
        0.12083311093641826,
        0.3097903723349198
      ],
      "role": "canceller"
    },
    "antonym": {
      "shift": -0.06876838207244873,
      "ci": [
        -0.10925476729869843,
        -0.028410428643226664
      ],
      "role": "writer"
    },
    "country_capital": {
      "shift": -0.005287914276123047,
      "ci": [
        -0.03337922716140747,
        0.025263847112655623
      ],
      "role": "null"
    }
  },
  "scaleExtension": {
    "hier-2.8B": {
      "family": "Pythia",
      "task": "hier",
      "size": "2.8B",
      "verdict": "canonical",
      "W_shift": -0.3,
      "C_shift": 0.28,
      "both_shift": 0.01,
      "canc_acc_delta": 0.07500000000000007
    },
    "mod-2.8B": {
      "family": "Pythia",
      "task": "mod",
      "size": "2.8B",
      "verdict": "canonical",
      "W_shift": -0.2,
      "C_shift": 0.19,
      "both_shift": 0.01,
      "canc_acc_delta": 0.07499999999999996
    },
    "hier-6.9B": {
      "family": "Pythia",
      "task": "hier",
      "size": "6.9B",
      "verdict": "canonical",
      "W_shift": -0.15,
      "C_shift": 0.13,
      "both_shift": 0.02,
      "canc_acc_delta": 0.04999999999999993
    },
    "mod-6.9B": {
      "family": "Pythia",
      "task": "mod",
      "size": "6.9B",
      "verdict": "partial",
      "W_shift": -0.11,
      "C_shift": 0.05,
      "both_shift": -0.01,
      "canc_acc_delta": -0.0050000000000000044
    },
    "hier-12B": {
      "family": "Pythia",
      "task": "hier",
      "size": "12B",
      "verdict": "partial",
      "W_shift": -0.1,
      "C_shift": 0.17,
      "both_shift": -0.01,
      "canc_acc_delta": 0.046666666666666634
    },
    "mod-12B": {
      "family": "Pythia",
      "task": "mod",
      "size": "12B",
      "verdict": "canonical",
      "W_shift": -0.11,
      "C_shift": 0.18,
      "both_shift": 0.11,
      "canc_acc_delta": 0.08666666666666667
    },
    "mod-Qwen1.5B": {
      "family": "Qwen2.5",
      "task": "mod",
      "size": "1.5B",
      "verdict": "canonical",
      "W_shift": -0.44,
      "C_shift": 0.11,
      "both_shift": -0.03,
      "canc_acc_delta": null
    },
    "mod-Qwen7B": {
      "family": "Qwen2.5",
      "task": "mod",
      "size": "7B",
      "verdict": "canonical",
      "W_shift": -0.11,
      "C_shift": 0.12,
      "both_shift": 0.1,
      "canc_acc_delta": null
    },
    "mod-GPT2-M": {
      "family": "GPT-2-medium",
      "task": "mod",
      "size": "355M",
      "verdict": "canonical",
      "W_shift": -0.33,
      "C_shift": 0.38,
      "both_shift": 0.03,
      "canc_acc_delta": null
    }
  },
  "perHead": {
    "hier-410M": {
      "writers": [
        {
          "id": "L11.H2",
          "L": 11,
          "H": 2,
          "dla": 0.10183543126234629,
          "z": 1.312890636245965
        },
        {
          "id": "L11.H14",
          "L": 11,
          "H": 14,
          "dla": 0.09638206463229532,
          "z": 0.5636292589078667
        },
        {
          "id": "L10.H9",
          "L": 10,
          "H": 9,
          "dla": 0.055906765954568984,
          "z": 0.3983767710820394
        },
        {
          "id": "L15.H5",
          "L": 15,
          "H": 5,
          "dla": 0.03368623909191229,
          "z": 1.568328740369427
        },
        {
          "id": "L11.H1",
          "L": 11,
          "H": 1,
          "dla": 0.031493651766019565,
          "z": 0.5533501340314049
        },
        {
          "id": "L21.H1",
          "L": 21,
          "H": 1,
          "dla": 0.02658213400670017,
          "z": 0.3207266208679025
        },
        {
          "id": "L16.H13",
          "L": 16,
          "H": 13,
          "dla": 0.01946151986485347,
          "z": 0.9139967422757868
        },
        {
          "id": "L17.H11",
          "L": 17,
          "H": 11,
          "dla": 0.013349196873605251,
          "z": 1.2021585292169865
        }
      ],
      "cancellers": [
        {
          "id": "L14.H3",
          "L": 14,
          "H": 3,
          "dla": -0.0350209326534241,
          "z": 0.4475720966235779
        },
        {
          "id": "L12.H0",
          "L": 12,
          "H": 0,
          "dla": -0.024457913514440103,
          "z": 0.2685707867826393
        },
        {
          "id": "L11.H4",
          "L": 11,
          "H": 4,
          "dla": -0.0235435238146844,
          "z": 1.1064242741025363
        },
        {
          "id": "L13.H1",
          "L": 13,
          "H": 1,
          "dla": -0.018657474135397933,
          "z": 0.46448745373627504
        },
        {
          "id": "L10.H8",
          "L": 10,
          "H": 8,
          "dla": -0.014616743385946998,
          "z": 0.33391323647735943
        },
        {
          "id": "L19.H15",
          "L": 19,
          "H": 15,
          "dla": -0.012496794113637104,
          "z": 0.30934314560604054
        }
      ],
      "group_attn": {
        "writer": {
          "BOS": 0.34833476851827827,
          "format_prefix": 0.035941447194761174,
          "demo_input": 0.13581318170949053,
          "demo_label": 0.4609480647686876,
          "query_input": 0.01896253780878255
        },
        "canceller": {
          "BOS": 0.344689416287087,
          "format_prefix": 0.14787100448488788,
          "demo_input": 0.10540342951160923,
          "demo_label": 0.3322458221486367,
          "query_input": 0.06979032756777921
        }
      }
    },
    "hier-1B": {
      "writers": [
        {
          "id": "L7.H0",
          "L": 7,
          "H": 0,
          "dla": 0.09561288356004903,
          "z": 1.0191960057215868
        },
        {
          "id": "L7.H2",
          "L": 7,
          "H": 2,
          "dla": 0.06354686116877321,
          "z": 0.9148174620163316
        },
        {
          "id": "L10.H6",
          "L": 10,
          "H": 6,
          "dla": 0.059262741232184155,
          "z": 0.8119534434377269
        },
        {
          "id": "L10.H5",
          "L": 10,
          "H": 5,
          "dla": 0.04093484726763563,
          "z": 0.702750329612881
        },
        {
          "id": "L13.H5",
          "L": 13,
          "H": 5,
          "dla": 0.03278784991804665,
          "z": 0.916323666415821
        },
        {
          "id": "L10.H4",
          "L": 10,
          "H": 4,
          "dla": 0.021972541710420047,
          "z": 1.6657703263184296
        },
        {
          "id": "L14.H2",
          "L": 14,
          "H": 2,
          "dla": 0.021562804943338662,
          "z": 1.5587411865471306
        },
        {
          "id": "L11.H2",
          "L": 11,
          "H": 2,
          "dla": -0.017283652839735927,
          "z": 0.2620761683637719
        },
        {
          "id": "L12.H0",
          "L": 12,
          "H": 0,
          "dla": 0.0073082267044810596,
          "z": 2.3032432890718835
        }
      ],
      "cancellers": [
        {
          "id": "L10.H2",
          "L": 10,
          "H": 2,
          "dla": -0.06883595207473263,
          "z": 0.7723983203514007
        },
        {
          "id": "L13.H1",
          "L": 13,
          "H": 1,
          "dla": -0.05534804407107004,
          "z": 1.0080083616978741
        },
        {
          "id": "L11.H6",
          "L": 11,
          "H": 6,
          "dla": -0.03832208231906407,
          "z": 0.5440530712066439
        },
        {
          "id": "L12.H5",
          "L": 12,
          "H": 5,
          "dla": -0.020674568293907212,
          "z": 0.4664034371556402
        }
      ],
      "group_attn": {
        "writer": {
          "BOS": 0.4107484090197392,
          "format_prefix": 0.11128538024938031,
          "demo_input": 0.09437408093071929,
          "demo_label": 0.3525507667000986,
          "query_input": 0.03104136310006257
        },
        "canceller": {
          "BOS": 0.4351494993032188,
          "format_prefix": 0.29145625301402794,
          "demo_input": 0.05663035048411944,
          "demo_label": 0.1817745177626266,
          "query_input": 0.03498937943600718
        }
      }
    },
    "hier-1.4B": {
      "writers": [
        {
          "id": "L10.H0",
          "L": 10,
          "H": 0,
          "dla": 0.14717813114063272,
          "z": 1.5352223808969607
        },
        {
          "id": "L15.H11",
          "L": 15,
          "H": 11,
          "dla": 0.050675274214396875,
          "z": 1.6276424898270239
        },
        {
          "id": "L10.H9",
          "L": 10,
          "H": 9,
          "dla": 0.04513525543734431,
          "z": 1.1070983613564624
        },
        {
          "id": "L22.H2",
          "L": 22,
          "H": 2,
          "dla": 0.020110895314913554,
          "z": 0.3780861496962039
        },
        {
          "id": "L18.H0",
          "L": 18,
          "H": 0,
          "dla": -0.0174816611133186,
          "z": 0.433709440775467
        },
        {
          "id": "L12.H1",
          "L": 12,
          "H": 1,
          "dla": 0.017217966824925195,
          "z": 0.6512236527276182
        },
        {
          "id": "L17.H7",
          "L": 17,
          "H": 7,
          "dla": 0.011667481464974117,
          "z": 0.9348856329710077
        },
        {
          "id": "L10.H11",
          "L": 10,
          "H": 11,
          "dla": 0.011596967890363885,
          "z": 0.7395744252629782
        },
        {
          "id": "L12.H15",
          "L": 12,
          "H": 15,
          "dla": 0.011474474377852553,
          "z": 2.552962469114189
        },
        {
          "id": "L10.H8",
          "L": 10,
          "H": 8,
          "dla": 0.009582057899873084,
          "z": 0.5548689893355839
        }
      ],
      "cancellers": [
        {
          "id": "L12.H7",
          "L": 12,
          "H": 7,
          "dla": -0.03732249274908099,
          "z": 1.4490418537688832
        },
        {
          "id": "L11.H2",
          "L": 11,
          "H": 2,
          "dla": -0.03020952320172607,
          "z": 0.6095718982135596
        },
        {
          "id": "L10.H7",
          "L": 10,
          "H": 7,
          "dla": -0.022954231527304123,
          "z": 0.8094647134361348
        },
        {
          "id": "L12.H0",
          "L": 12,
          "H": 0,
          "dla": 0.005173064434105375,
          "z": 0.5902096229287792
        }
      ],
      "group_attn": {
        "writer": {
          "BOS": 0.2841016277568936,
          "format_prefix": 0.12677684832023192,
          "demo_input": 0.05472411688718966,
          "demo_label": 0.5179318280784323,
          "query_input": 0.0164655789572525
        },
        "canceller": {
          "BOS": 0.2654782325906514,
          "format_prefix": 0.2569436734037928,
          "demo_input": 0.0605706480403273,
          "demo_label": 0.3708527440043622,
          "query_input": 0.04615470196086633
        }
      }
    },
    "mod-410M": {
      "writers": [
        {
          "id": "L13.H5",
          "L": 13,
          "H": 5,
          "dla": 0.08329231113069302,
          "z": 1.6559701780464475
        },
        {
          "id": "L17.H11",
          "L": 17,
          "H": 11,
          "dla": 0.050508472457295284,
          "z": 1.2801136272265647
        },
        {
          "id": "L11.H14",
          "L": 11,
          "H": 14,
          "dla": 0.0258682035911382,
          "z": 0.4283483138053954
        },
        {
          "id": "L11.H2",
          "L": 11,
          "H": 2,
          "dla": 0.023685998862007784,
          "z": 0.8274693656604132
        },
        {
          "id": "L16.H13",
          "L": 16,
          "H": 13,
          "dla": 0.010373934750289967,
          "z": 1.0671502959465222
        },
        {
          "id": "L21.H5",
          "L": 21,
          "H": 5,
          "dla": 0.005122860446378276,
          "z": 2.094832912564224
        },
        {
          "id": "L15.H5",
          "L": 15,
          "H": 5,
          "dla": 0.005103430736926384,
          "z": 1.4645672353998216
        },
        {
          "id": "L23.H2",
          "L": 23,
          "H": 2,
          "dla": 0.004471999049807588,
          "z": 0.2844015182824705
        }
      ],
      "cancellers": [
        {
          "id": "L11.H4",
          "L": 11,
          "H": 4,
          "dla": -0.08849328786794405,
          "z": 0.9502298383829882
        },
        {
          "id": "L14.H3",
          "L": 14,
          "H": 3,
          "dla": -0.019957129734818106,
          "z": 0.3673624790500835
        },
        {
          "id": "L12.H0",
          "L": 12,
          "H": 0,
          "dla": -0.017531833810789977,
          "z": 0.2588182006440129
        }
      ],
      "group_attn": {
        "writer": {
          "BOS": 0.33875200362963864,
          "format_prefix": 0.1698644579459975,
          "demo_input": 0.10796649893226837,
          "demo_label": 0.3592799076467776,
          "query_input": 0.024137131845317787
        },
        "canceller": {
          "BOS": 0.3846408090764264,
          "format_prefix": 0.25818651794701014,
          "demo_input": 0.06414729420279423,
          "demo_label": 0.24304695790889963,
          "query_input": 0.049978420864869595
        }
      }
    },
    "mod-1B": {
      "writers": [
        {
          "id": "L10.H4",
          "L": 10,
          "H": 4,
          "dla": 0.032709628079707426,
          "z": 2.1984701854537128
        },
        {
          "id": "L12.H0",
          "L": 12,
          "H": 0,
          "dla": 0.03171287755152056,
          "z": 2.24115833340664
        },
        {
          "id": "L14.H2",
          "L": 14,
          "H": 2,
          "dla": -0.030942394729936498,
          "z": 1.330864441877426
        },
        {
          "id": "L13.H5",
          "L": 13,
          "H": 5,
          "dla": 0.03003342730177489,
          "z": 1.066830043686709
        },
        {
          "id": "L7.H0",
          "L": 7,
          "H": 0,
          "dla": 0.028666439977435704,
          "z": 0.7575280604451512
        },
        {
          "id": "L7.H2",
          "L": 7,
          "H": 2,
          "dla": 0.023193126804350563,
          "z": 0.6234732076445464
        },
        {
          "id": "L11.H2",
          "L": 11,
          "H": 2,
          "dla": 0.01409328066317054,
          "z": 0.31596000820642617
        },
        {
          "id": "L13.H2",
          "L": 13,
          "H": 2,
          "dla": 0.012158245271227011,
          "z": 0.28739828848786114
        }
      ],
      "cancellers": [
        {
          "id": "L8.H7",
          "L": 8,
          "H": 7,
          "dla": -0.02562042216571475,
          "z": 0.26779467568066384
        },
        {
          "id": "L13.H1",
          "L": 13,
          "H": 1,
          "dla": -0.024287196111739223,
          "z": 0.8762661046730436
        },
        {
          "id": "L11.H6",
          "L": 11,
          "H": 6,
          "dla": -0.019892414290613183,
          "z": 0.5585633616862545
        },
        {
          "id": "L12.H4",
          "L": 12,
          "H": 4,
          "dla": -0.016474667702277655,
          "z": 0.3830123942290264
        },
        {
          "id": "L10.H2",
          "L": 10,
          "H": 2,
          "dla": -0.012922435261619588,
          "z": 0.5553772962881871
        },
        {
          "id": "L12.H1",
          "L": 12,
          "H": 1,
          "dla": -0.009702949218384068,
          "z": 0.2600917480420184
        }
      ],
      "group_attn": {
        "writer": {
          "BOS": 0.4395328645106608,
          "format_prefix": 0.12491288285897419,
          "demo_input": 0.07153282212723074,
          "demo_label": 0.3359104253114131,
          "query_input": 0.028111005191721196
        },
        "canceller": {
          "BOS": 0.45842252801165045,
          "format_prefix": 0.195157803982606,
          "demo_input": 0.06779363208509835,
          "demo_label": 0.2178550247702436,
          "query_input": 0.06077101115040159
        }
      }
    },
    "mod-1.4B": {
      "writers": [
        {
          "id": "L12.H15",
          "L": 12,
          "H": 15,
          "dla": 0.06895777341536208,
          "z": 2.045375120945508
        },
        {
          "id": "L10.H11",
          "L": 10,
          "H": 11,
          "dla": 0.027545032669149806,
          "z": 0.6708998989072381
        },
        {
          "id": "L10.H0",
          "L": 10,
          "H": 0,
          "dla": 0.02420785890086942,
          "z": 0.9297570815026239
        },
        {
          "id": "L11.H1",
          "L": 11,
          "H": 1,
          "dla": 0.02413674335427156,
          "z": 0.5261955701727031
        },
        {
          "id": "L17.H10",
          "L": 17,
          "H": 10,
          "dla": 0.021614165394566953,
          "z": 0.9015774092754589
        },
        {
          "id": "L18.H0",
          "L": 18,
          "H": 0,
          "dla": 0.02120284233630324,
          "z": 0.3939729356525902
        },
        {
          "id": "L22.H2",
          "L": 22,
          "H": 2,
          "dla": -0.019786309511982833,
          "z": 0.2622071786627545
        },
        {
          "id": "L13.H6",
          "L": 13,
          "H": 6,
          "dla": 0.01081528204085771,
          "z": 0.41754117287996056
        },
        {
          "id": "L12.H1",
          "L": 12,
          "H": 1,
          "dla": -0.010728381872953226,
          "z": 0.5553829412946223
        },
        {
          "id": "L15.H11",
          "L": 15,
          "H": 11,
          "dla": 0.006934864423237742,
          "z": 1.663919963885252
        },
        {
          "id": "L17.H7",
          "L": 17,
          "H": 7,
          "dla": 0.00476006640625807,
          "z": 1.0378087805360372
        }
      ],
      "cancellers": [
        {
          "id": "L10.H7",
          "L": 10,
          "H": 7,
          "dla": -0.06466761129607525,
          "z": 0.5496454956789794
        },
        {
          "id": "L12.H0",
          "L": 12,
          "H": 0,
          "dla": -0.04233434872924893,
          "z": 0.38957464796703334
        },
        {
          "id": "L13.H2",
          "L": 13,
          "H": 2,
          "dla": -0.02315277266607154,
          "z": 0.3500064491037499
        },
        {
          "id": "L11.H2",
          "L": 11,
          "H": 2,
          "dla": -0.010323012077424209,
          "z": 0.42545441681108986
        }
      ],
      "group_attn": {
        "writer": {
          "BOS": 0.3245601661379432,
          "format_prefix": 0.13387180341991808,
          "demo_input": 0.06495352950115545,
          "demo_label": 0.4504718084338867,
          "query_input": 0.02614269250709663
        },
        "canceller": {
          "BOS": 0.2484994789029607,
          "format_prefix": 0.2538902914567138,
          "demo_input": 0.07398029644605447,
          "demo_label": 0.36404915431580886,
          "query_input": 0.059580778878462165
        }
      }
    }
  },
  "buckets": [
    "BOS",
    "format_prefix",
    "demo_input",
    "demo_label",
    "query_input"
  ]
};
