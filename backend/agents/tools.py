"""Tool specifications for the Orchestrator agent in Bedrock Converse API format."""

ORCHESTRATOR_TOOLS = [
    {
        "toolSpec": {
            "name": "assess_emotional_state",
            "description": "Analyze the student's message to determine their emotional state across 5 dimensions: engagement, confidence, frustration, curiosity, and cognitive_load. Each dimension is a float from 0.0 to 1.0.",
            "inputSchema": {
                "json": {
                    "type": "object",
                    "properties": {
                        "student_message": {
                            "type": "string",
                            "description": "The student's message to analyze for emotional content",
                        },
                        "conversation_context": {
                            "type": "string",
                            "description": "Recent conversation history for additional context",
                        },
                    },
                    "required": ["student_message"],
                }
            },
        }
    },
    {
        "toolSpec": {
            "name": "adapt_content",
            "description": "Reshape educational content based on the student's current emotional state. Simplifies when frustrated, adds depth when curious, gamifies when disengaged.",
            "inputSchema": {
                "json": {
                    "type": "object",
                    "properties": {
                        "current_topic": {
                            "type": "string",
                            "description": "The topic or concept currently being taught",
                        },
                        "emotional_state": {
                            "type": "object",
                            "description": "The student's emotional state with 5 dimensions",
                            "properties": {
                                "engagement": {"type": "number"},
                                "confidence": {"type": "number"},
                                "frustration": {"type": "number"},
                                "curiosity": {"type": "number"},
                                "cognitive_load": {"type": "number"},
                            },
                        },
                        "student_message": {
                            "type": "string",
                            "description": "The student's original message for context",
                        },
                    },
                    "required": ["current_topic", "emotional_state", "student_message"],
                }
            },
        }
    },
    {
        "toolSpec": {
            "name": "generate_assessment",
            "description": "Create emotionally-calibrated quiz questions that match the student's current emotional state. Adjusts difficulty and style based on frustration, confidence, and cognitive load.",
            "inputSchema": {
                "json": {
                    "type": "object",
                    "properties": {
                        "topic": {
                            "type": "string",
                            "description": "The topic to generate assessment questions for",
                        },
                        "emotional_state": {
                            "type": "object",
                            "description": "The student's emotional state with 5 dimensions",
                            "properties": {
                                "engagement": {"type": "number"},
                                "confidence": {"type": "number"},
                                "frustration": {"type": "number"},
                                "curiosity": {"type": "number"},
                                "cognitive_load": {"type": "number"},
                            },
                        },
                        "num_questions": {
                            "type": "integer",
                            "description": "Number of questions to generate (default: 3)",
                        },
                    },
                    "required": ["topic", "emotional_state"],
                }
            },
        }
    },
    {
        "toolSpec": {
            "name": "parse_curriculum",
            "description": "Parse raw educational content into a structured learning graph with nodes, prerequisites, and learning objectives.",
            "inputSchema": {
                "json": {
                    "type": "object",
                    "properties": {
                        "raw_content": {
                            "type": "string",
                            "description": "The raw educational content to parse into a curriculum graph",
                        },
                        "subject_hint": {
                            "type": "string",
                            "description": "Optional hint about the subject area to guide parsing",
                        },
                    },
                    "required": ["raw_content"],
                }
            },
        }
    },
    {
        "toolSpec": {
            "name": "get_next_curriculum_node",
            "description": "Get the next available curriculum node for the student based on their progress. Returns the next uncompleted node whose prerequisites are all met.",
            "inputSchema": {
                "json": {
                    "type": "object",
                    "properties": {
                        "session_id": {
                            "type": "string",
                            "description": "The session ID to look up curriculum progress",
                        },
                        "current_node_id": {
                            "type": "string",
                            "description": "The ID of the currently active node (optional)",
                        },
                    },
                    "required": ["session_id"],
                }
            },
        }
    },
]
