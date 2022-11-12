import { FactorioInfo } from "./FactorioData";

export const segmentedDisplay: FactorioInfo = {
    "blueprint": {
        "description": "Single digit display\n\nInput most right combinator",
        "icons": [
            {
                "signal": {
                    "type": "item",
                    "name": "small-lamp"
                },
                "index": 1
            }
        ],
        "entities": [
            {
                "entity_number": 1,
                "name": "small-lamp",
                "position": {
                    "x": -211.5,
                    "y": 271.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 3
                            },
                            {
                                "entity_id": 11
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 2,
                "name": "small-lamp",
                "position": {
                    "x": -210.5,
                    "y": 270.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 3
                            },
                            {
                                "entity_id": 4
                            },
                            {
                                "entity_id": 5
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 3,
                "name": "small-lamp",
                "position": {
                    "x": -211.5,
                    "y": 270.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 2
                            },
                            {
                                "entity_id": 1
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 4,
                "name": "small-lamp",
                "position": {
                    "x": -210.5,
                    "y": 271.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-C"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 2
                            },
                            {
                                "entity_id": 13
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 5,
                "name": "small-lamp",
                "position": {
                    "x": -209.5,
                    "y": 270.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-A"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 2
                            },
                            {
                                "entity_id": 6
                            },
                            {
                                "entity_id": 7
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 6,
                "name": "small-lamp",
                "position": {
                    "x": -209.5,
                    "y": 271.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 5
                            },
                            {
                                "entity_id": 15
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 7,
                "name": "small-lamp",
                "position": {
                    "x": -208.5,
                    "y": 270.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-A"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 5
                            },
                            {
                                "entity_id": 8
                            },
                            {
                                "entity_id": 10
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 8,
                "name": "small-lamp",
                "position": {
                    "x": -208.5,
                    "y": 271.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 7
                            },
                            {
                                "entity_id": 18
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 9,
                "name": "small-lamp",
                "position": {
                    "x": -207.5,
                    "y": 271.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-B"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 10
                            },
                            {
                                "entity_id": 19
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 10,
                "name": "small-lamp",
                "position": {
                    "x": -207.5,
                    "y": 270.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 7
                            },
                            {
                                "entity_id": 9
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 11,
                "name": "small-lamp",
                "position": {
                    "x": -211.5,
                    "y": 272.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 1
                            },
                            {
                                "entity_id": 12
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 12,
                "name": "small-lamp",
                "position": {
                    "x": -211.5,
                    "y": 273.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 11
                            },
                            {
                                "entity_id": 21
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 13,
                "name": "small-lamp",
                "position": {
                    "x": -210.5,
                    "y": 272.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-C"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 4
                            },
                            {
                                "entity_id": 14
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 14,
                "name": "small-lamp",
                "position": {
                    "x": -210.5,
                    "y": 273.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 13
                            },
                            {
                                "entity_id": 24
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 15,
                "name": "small-lamp",
                "position": {
                    "x": -209.5,
                    "y": 272.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 6
                            },
                            {
                                "entity_id": 17
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 16,
                "name": "small-lamp",
                "position": {
                    "x": -208.5,
                    "y": 273.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-D"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 18
                            },
                            {
                                "entity_id": 26
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 17,
                "name": "small-lamp",
                "position": {
                    "x": -209.5,
                    "y": 273.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-D"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 15
                            },
                            {
                                "entity_id": 28
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 18,
                "name": "small-lamp",
                "position": {
                    "x": -208.5,
                    "y": 272.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 8
                            },
                            {
                                "entity_id": 16
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 19,
                "name": "small-lamp",
                "position": {
                    "x": -207.5,
                    "y": 272.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-B"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 9
                            },
                            {
                                "entity_id": 20
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 20,
                "name": "small-lamp",
                "position": {
                    "x": -207.5,
                    "y": 273.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 19
                            },
                            {
                                "entity_id": 29
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 21,
                "name": "small-lamp",
                "position": {
                    "x": -211.5,
                    "y": 274.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 12
                            },
                            {
                                "entity_id": 23
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 22,
                "name": "small-lamp",
                "position": {
                    "x": -210.5,
                    "y": 275.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-F"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 24
                            },
                            {
                                "entity_id": 33
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 23,
                "name": "small-lamp",
                "position": {
                    "x": -211.5,
                    "y": 275.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 21
                            },
                            {
                                "entity_id": 34
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 24,
                "name": "small-lamp",
                "position": {
                    "x": -210.5,
                    "y": 274.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-F"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 22
                            },
                            {
                                "entity_id": 14
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 25,
                "name": "small-lamp",
                "position": {
                    "x": -209.5,
                    "y": 275.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 28
                            },
                            {
                                "entity_id": 38
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 26,
                "name": "small-lamp",
                "position": {
                    "x": -208.5,
                    "y": 274.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 16
                            },
                            {
                                "entity_id": 27
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 27,
                "name": "small-lamp",
                "position": {
                    "x": -208.5,
                    "y": 275.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 26
                            },
                            {
                                "entity_id": 37
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 28,
                "name": "small-lamp",
                "position": {
                    "x": -209.5,
                    "y": 274.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 25
                            },
                            {
                                "entity_id": 17
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 29,
                "name": "small-lamp",
                "position": {
                    "x": -207.5,
                    "y": 274.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-E"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 20
                            },
                            {
                                "entity_id": 30
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 30,
                "name": "small-lamp",
                "position": {
                    "x": -207.5,
                    "y": 275.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-E"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 29
                            },
                            {
                                "entity_id": 41
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 31,
                "name": "arithmetic-combinator",
                "position": {
                    "x": -211.5,
                    "y": 278
                },
                "control_behavior": {
                    "arithmetic_conditions": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        },
                        "second_constant": 2,
                        "operation": "%",
                        "output_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        }
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 32,
                                "circuit_id": 2
                            }
                        ]
                    },
                    "2": {
                        "red": [
                            {
                                "entity_id": 41
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 32,
                "name": "arithmetic-combinator",
                "position": {
                    "x": -210.5,
                    "y": 278
                },
                "control_behavior": {
                    "arithmetic_conditions": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        },
                        "second_signal": {
                            "type": "virtual",
                            "name": "signal-green"
                        },
                        "operation": ">>",
                        "output_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        }
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 36,
                                "circuit_id": 2
                            }
                        ],
                        "green": [
                            {
                                "entity_id": 40
                            }
                        ]
                    },
                    "2": {
                        "red": [
                            {
                                "entity_id": 31,
                                "circuit_id": 1
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 33,
                "name": "small-lamp",
                "position": {
                    "x": -210.5,
                    "y": 276.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 22
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 34,
                "name": "small-lamp",
                "position": {
                    "x": -211.5,
                    "y": 276.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 23
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 35,
                "name": "arithmetic-combinator",
                "position": {
                    "x": -208.5,
                    "y": 278
                },
                "control_behavior": {
                    "arithmetic_conditions": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        },
                        "second_constant": 10,
                        "operation": "/",
                        "output_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        }
                    }
                },
                "connections": {
                    "1": {
                        "green": [
                            {
                                "entity_id": 36,
                                "circuit_id": 1
                            },
                            {
                                "entity_id": 39,
                                "circuit_id": 2
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 36,
                "name": "arithmetic-combinator",
                "position": {
                    "x": -209.5,
                    "y": 278
                },
                "control_behavior": {
                    "arithmetic_conditions": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        },
                        "second_constant": 10,
                        "operation": "%",
                        "output_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        }
                    }
                },
                "connections": {
                    "1": {
                        "green": [
                            {
                                "entity_id": 35,
                                "circuit_id": 1
                            }
                        ]
                    },
                    "2": {
                        "red": [
                            {
                                "entity_id": 32,
                                "circuit_id": 1
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 37,
                "name": "small-lamp",
                "position": {
                    "x": -208.5,
                    "y": 276.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-G"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 27
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 38,
                "name": "small-lamp",
                "position": {
                    "x": -209.5,
                    "y": 276.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-G"
                        },
                        "constant": 1,
                        "comparator": "="
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 25
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 39,
                "name": "arithmetic-combinator",
                "position": {
                    "x": -207.5,
                    "y": 278
                },
                "control_behavior": {
                    "arithmetic_conditions": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-each"
                        },
                        "second_constant": 1,
                        "operation": "*",
                        "output_signal": {
                            "type": "virtual",
                            "name": "signal-green"
                        }
                    }
                },
                "connections": {
                    "2": {
                        "green": [
                            {
                                "entity_id": 35,
                                "circuit_id": 1
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 40,
                "name": "constant-combinator",
                "position": {
                    "x": -206.5,
                    "y": 277.5
                },
                "control_behavior": {
                    "filters": [
                        {
                            "signal": {
                                "type": "virtual",
                                "name": "signal-A"
                            },
                            "count": 1005,
                            "index": 1
                        },
                        {
                            "signal": {
                                "type": "virtual",
                                "name": "signal-B"
                            },
                            "count": 927,
                            "index": 2
                        },
                        {
                            "signal": {
                                "type": "virtual",
                                "name": "signal-C"
                            },
                            "count": 881,
                            "index": 3
                        },
                        {
                            "signal": {
                                "type": "virtual",
                                "name": "signal-D"
                            },
                            "count": 892,
                            "index": 4
                        },
                        {
                            "signal": {
                                "type": "virtual",
                                "name": "signal-E"
                            },
                            "count": 1019,
                            "index": 5
                        },
                        {
                            "signal": {
                                "type": "virtual",
                                "name": "signal-F"
                            },
                            "count": 325,
                            "index": 6
                        },
                        {
                            "signal": {
                                "type": "virtual",
                                "name": "signal-G"
                            },
                            "count": 877,
                            "index": 7
                        }
                    ]
                },
                "connections": {
                    "1": {
                        "green": [
                            {
                                "entity_id": 32,
                                "circuit_id": 1
                            }
                        ]
                    }
                }
            },
            {
                "entity_number": 41,
                "name": "small-lamp",
                "position": {
                    "x": -207.5,
                    "y": 276.5
                },
                "control_behavior": {
                    "circuit_condition": {
                        "first_signal": {
                            "type": "virtual",
                            "name": "signal-anything"
                        },
                        "constant": 1,
                        "comparator": "<"
                    }
                },
                "connections": {
                    "1": {
                        "red": [
                            {
                                "entity_id": 30
                            },
                            {
                                "entity_id": 31,
                                "circuit_id": 2
                            }
                        ]
                    }
                }
            }
        ],
        "item": "blueprint",
        "label": "Single digit display",
        "version": 281479276265473
    }
};


export const numberRows = 7;
export const numberColumns = 5;


export const entityMap = [
    3,2,5,7,10,
    1,4,6,8,9,
    11,13,15,18,19,
    12,14,17,16,20,
    21,24,28,26,29,
    23,22,25,27,30,
    34,33,38,37,41
];

export const virtualSignals = [
"signal-0",
"signal-1",
"signal-2",
"signal-3",
"signal-4",
"signal-5",
"signal-6",
"signal-7",
"signal-8",
"signal-9",
"signal-A",
"signal-B",
"signal-C",
"signal-D",
"signal-E",
"signal-F",
"signal-G",
"signal-H",
"signal-I",
"signal-J",
"signal-K",
"signal-L",
"signal-M",
"signal-N",
"signal-O",
"signal-P",
"signal-Q",
"signal-R",
"signal-S",
"signal-T",
"signal-U",
"signal-V",
"signal-W",
"signal-X",
"signal-Y"
];
