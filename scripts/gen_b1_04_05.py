#!/usr/bin/env python3
"""
Script to generate the remaining German B1 (04-14) and B2 (01-14) grammar lesson JSON files.
Run from inside 'Learning language app' workspace dir.
"""
import json
import os

BASE = "/home/oradwan/Desktop/Learning language app/assets/grammar/german"

def write_lesson(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ {path}")

# =====================================================================
# B1 LESSONS 04–14
# =====================================================================
b1_lessons = [
    {
        "id": "de_b1_04", "order": 4, "level": "B1",
        "title": "Konzessivsätze — Concessive Clauses",
        "description": "Learn to express contrast and concession using obwohl, trotzdem, although, and despite.",
        "explanation": "Concessive clauses express a contrast — something happens DESPITE a contrary expectation.\n\n• obwohl (although/even though) — SUBORDINATING → verb at end\n  → Obwohl es regnete, gingen wir spazieren.\n\n• trotzdem (nevertheless/still) — ADVERB → causes inversion in position 1\n  → Es regnete. Trotzdem gingen wir spazieren.\n\n• auch wenn (even if/even though) — Konjunktiv II possible\n  → Auch wenn es regnen würde, gingen wir.\n\n• wenngleich / obschon — formal, literary equivalents of obwohl",
        "tables": [
            {
                "title": "Concessive Connectors Overview",
                "headers": ["Connector", "Type", "Verb Position", "Example"],
                "rows": [
                    ["obwohl", "Subordinating", "Verb at END", "Obwohl ich müde bin, arbeite ich."],
                    ["trotzdem", "Adverb", "V2 (inversion)", "Ich bin müde. Trotzdem arbeite ich."],
                    ["obwohl...doch", "Double connector", "Both clauses normal", "Obwohl er krank ist, geht er doch zur Arbeit."],
                    ["auch wenn", "Subordinating", "Verb at END", "Auch wenn du bittest, sage ich nein."],
                    ["trotz + Genitiv", "Preposition phrase", "Normal", "Trotz des Regens gingen wir raus."]
                ],
                "note": "In spoken German, 'trotzdem' is more common than 'obwohl' for contrast."
            }
        ],
        "deep_notes": [
            {
                "title": "obwohl vs. obwohl...doch",
                "text": "'Obwohl' alone is sufficient. Adding 'doch' or 'dennoch' to the main clause adds emphasis: 'Obwohl er sehr müde war, machte er doch weiter.' The extra 'doch' stresses the surprising continuation."
            },
            {
                "title": "trotzdem sentence position",
                "text": "'Trotzdem' can appear in different positions: (1) At position 1: 'Trotzdem ging er.' (2) After subject: 'Er ging trotzdem.' Both are correct; position 1 emphasizes the contrast more strongly."
            }
        ],
        "examples": [
            { "german": "Obwohl sie krank war, kam sie zur Arbeit.", "english": "Although she was sick, she came to work.", "explanation": "obwohl-clause first → main clause inverts: 'kam sie'." },
            { "german": "Es war sehr kalt. Trotzdem gingen die Kinder draußen spielen.", "english": "It was very cold. Nevertheless the children went to play outside.", "explanation": "trotzdem at position 1 → inversion: 'gingen die Kinder'." },
            { "german": "Trotz des schlechten Wetters machten wir einen Ausflug.", "english": "Despite the bad weather, we went on an excursion.", "explanation": "trotz + Genitiv: des schlechten Wetters." },
            { "german": "Auch wenn ich keine Lust habe, muss ich das tun.", "english": "Even if I don't feel like it, I have to do it.", "explanation": "auch wenn → verb at end ('habe'), main clause follows normally." }
        ],
        "exercises": [
            { "type": "multiple_choice", "question": "Choose the correct word: ___ er sehr müde war, schlief er nicht.", "options": ["Trotzdem", "Obwohl", "Wegen", "Denn"], "correctAnswer": "Obwohl", "explanation": "obwohl = although (subordinating). 'trotzdem' cannot start a subordinate clause." },
            { "type": "fill_blank", "question": "Sie hat die Prüfung bestanden, ____ sie wenig gelernt hatte.", "text": "Sie hat die Prüfung bestanden, ____ sie wenig gelernt hatte.", "options": ["obwohl", "trotzdem", "weil", "als"], "correctAnswer": "obwohl", "explanation": "obwohl = although. Verb 'hatte' at the end of the clause." },
            { "type": "reorder", "question": "Build: Although it was expensive, she bought it.", "words": ["Obwohl", "es", "teuer", "war,", "kaufte", "sie", "es."], "correctAnswer": "Obwohl es teuer war, kaufte sie es.", "explanation": "obwohl-clause first → main clause inverts: 'kaufte sie'." },
            { "type": "write", "question": "Translate: He kept working despite being tired. (trotzdem)", "correctAnswer": "Er war müde. Trotzdem arbeitete er weiter.", "hint": "Two separate sentences connected by trotzdem", "explanation": "trotzdem at position 1 → inversion: 'arbeitete er'." },
            { "type": "multiple_choice", "question": "Trotz ___ Erkältung ging er joggen.", "options": ["seine", "seiner", "seinem", "seinen"], "correctAnswer": "seiner", "explanation": "trotz + Genitiv. 'Erkältung' is feminine. Genitiv feminine = seiner Erkältung." },
            { "type": "match", "question": "Match each connector to its meaning:", "pairs": [{ "left": "obwohl", "right": "although" }, { "left": "trotzdem", "right": "nevertheless" }, { "left": "trotz + Gen.", "right": "despite" }, { "left": "auch wenn", "right": "even if" }], "correctAnswer": None, "explanation": "Four key concessive connectors." },
            { "type": "fill_blank", "question": "Es war ein schwieriges Spiel. ____ gewann unsere Mannschaft.", "text": "Es war ein schwieriges Spiel. ____ gewann unsere Mannschaft.", "options": ["Obwohl", "Weil", "Trotzdem", "Da"], "correctAnswer": "Trotzdem", "explanation": "trotzdem = nevertheless. Starts new sentence, causes inversion." },
            { "type": "write", "question": "Combine into one sentence with 'obwohl': Das Essen war kalt. Wir haben es gegessen.", "correctAnswer": "Obwohl das Essen kalt war, haben wir es gegessen.", "hint": "obwohl with verb at end, then inverted main clause", "explanation": "obwohl → verb last: 'kalt war'. Then inverted main: 'haben wir'." },
            { "type": "multiple_choice", "question": "Which is the MOST formal way to say 'although'?", "options": ["trotzdem", "obwohl", "wenngleich", "aber"], "correctAnswer": "wenngleich", "explanation": "'Wenngleich' is the formal/literary equivalent of 'obwohl', used in written texts and speeches." },
            { "type": "listen_and_answer", "question": "Listen and choose:", "audio_text": "Obwohl sie sehr müde war, lernte sie noch zwei Stunden.", "options": ["Obwohl sie sehr müde war, lernte sie noch zwei Stunden.", "Trotzdem sie müde war, lernte sie weiter.", "Obwohl sie lernte, war sie müde.", "Weil sie müde war, hörte sie auf."], "correctAnswer": "Obwohl sie sehr müde war, lernte sie noch zwei Stunden.", "explanation": "'Obwohl sie sehr müde war, lernte sie noch zwei Stunden.' — Although she was very tired, she studied for two more hours." },
            { "type": "table_fill", "question": "Fill in the correct concessive connector:", "headers": ["Meaning", "Connector"], "rows": [["although (subord.)", "{obwohl}"], ["despite (prep.+Gen.)", "{trotz}"], ["nevertheless (adv.)", "{trotzdem}"]], "correctAnswers": ["obwohl", "trotz", "trotzdem"], "explanation": "Three different grammatical forms of expressing concession." }
        ]
    },
    {
        "id": "de_b1_05", "order": 5, "level": "B1",
        "title": "Konnektoren — Linking Words Advanced",
        "description": "Master advanced conjunctions and discourse connectors for complex, coherent German texts.",
        "explanation": "At B1, you need a wider range of connectors to build complex sentences and cohesive texts.\n\nCoordinating (verb stays position 2):\n• und (and), aber (but), oder (or), denn (because), sondern (but rather)\n\nSubordinating (verb to end):\n• weil, obwohl, als, wenn, bevor, nachdem, bis, seit, damit, sodass\n\nAdverbial (often cause inversion at position 1):\n• trotzdem (nevertheless), deshalb/daher/deswegen (therefore), außerdem (moreover)\n• zunächst (first), dann (then), schließlich (finally), danach (afterwards)\n• einerseits/andererseits (on the one hand/on the other hand)\n• allerdings (however/though), inzwischen (meanwhile)",
        "tables": [
            {"title": "Cause & Effect Connectors", "headers": ["Connector", "Type", "Meaning", "Example"], "rows": [
                ["weil", "Subordinating", "because", "Ich gehe raus, weil das Wetter schön ist."],
                ["denn", "Coordinating", "because (for)", "Ich gehe raus, denn das Wetter ist schön."],
                ["deshalb/deswegen/daher", "Adverb", "therefore/that's why", "Das Wetter ist schön. Deshalb gehe ich raus."],
                ["da", "Subordinating (formal)", "since/as", "Da das Wetter schön ist, gehe ich raus."],
                ["nämlich", "Adverb (after subject)", "namely/you see", "Ich gehe raus. Das Wetter ist nämlich schön."]
            ]},
            {"title": "Sequence & Structure Connectors", "headers": ["Connector", "Meaning", "Position"], "rows": [
                ["zunächst", "first of all", "Position 1 → inversion"],
                ["dann / danach / anschließend", "then / afterwards", "Position 1 → inversion"],
                ["schließlich / zuletzt", "finally / lastly", "Position 1 → inversion"],
                ["außerdem / zudem / darüber hinaus", "moreover / in addition", "Position 1 → inversion"],
                ["einerseits...andererseits", "on the one hand...other", "Position 1 each"],
                ["inzwischen / mittlerweile", "meanwhile / by now", "Position 1 → inversion"]
            ]}
        ],
        "deep_notes": [
            {"title": "deshalb vs. weil", "text": "'Weil' introduces the reason in a clause (verb at end). 'Deshalb' introduces the RESULT/consequence: 'Es regnet, weil die Luft feucht ist.' → cause. 'Es ist feucht. Deshalb regnet es.' → consequence."},
            {"title": "nämlich position", "text": "'Nämlich' is special — it sits AFTER the subject and verb in position 3+: 'Das Geschäft war nämlich geschlossen.' NOT at position 1. It softer than 'denn'."}
        ],
        "examples": [
            {"german": "Er hat das Projekt nicht abgegeben. Deshalb hat er den Job verloren.", "english": "He didn't submit the project. Therefore he lost the job.", "explanation": "deshalb at position 1 → inversion: 'hat er'."},
            {"german": "Zunächst begrüßte der Chef alle Mitarbeiter, dann begann die Besprechung.", "english": "First the manager greeted all employees, then the meeting began.", "explanation": "Sequential structure with zunächst...dann."},
            {"german": "Das Restaurant war gut. Das Essen war nämlich frisch.", "english": "The restaurant was good. The food was fresh, you see.", "explanation": "nämlich in position 3+ (after subject + verb)."},
            {"german": "Einerseits möchte ich gerne reisen, andererseits habe ich kein Geld.", "english": "On the one hand I'd like to travel, on the other hand I have no money.", "explanation": "einerseits...andererseits — balanced contrast connector."}
        ],
        "exercises": [
            {"type": "multiple_choice", "question": "Ich bin müde. ___ gehe ich früh ins Bett.", "options": ["Weil", "Deshalb", "Obwohl", "Denn"], "correctAnswer": "Deshalb", "explanation": "deshalb = therefore (consequence). Position 1 → inversion: 'gehe ich'."},
            {"type": "fill_blank", "question": "Ich bin nicht gekommen, ____ ich krank war.", "text": "Ich bin nicht gekommen, ____ ich krank war.", "options": ["deshalb", "denn", "weil", "trotzdem"], "correctAnswer": "weil", "explanation": "weil = because + verb at end: 'krank war'."},
            {"type": "reorder", "question": "Build: First she read the report, then she called her boss.", "words": ["Zunächst", "las", "sie", "den", "Bericht,", "dann", "rief", "sie", "ihren", "Chef", "an."], "correctAnswer": "Zunächst las sie den Bericht, dann rief sie ihren Chef an.", "explanation": "Both 'zunächst' and 'dann' at position 1 → inversion each time."},
            {"type": "write", "question": "Use 'außerdem': The hotel was expensive. Moreover, the service was bad.", "correctAnswer": "Das Hotel war teuer. Außerdem war der Service schlecht.", "hint": "außerdem at position 1 → inversion", "explanation": "außerdem = moreover/in addition. Position 1 → inversion: 'war der Service'."},
            {"type": "multiple_choice", "question": "Das Kino war ____ leider ausverkauft.", "options": ["nämlich", "deshalb", "trotzdem", "außerdem"], "correctAnswer": "nämlich", "explanation": "'nämlich' appears after subject+verb, softly explaining: 'you see, it was sold out'. Position 3+."},
            {"type": "match", "question": "Match each connector to its function:", "pairs": [{"left": "deshalb", "right": "consequence"}, {"left": "weil", "right": "reason (verb last)"}, {"left": "außerdem", "right": "addition"}, {"left": "trotzdem", "right": "contrast"}], "correctAnswer": None, "explanation": "Four key logical connectors."},
            {"type": "fill_blank", "question": "Einerseits ist die Wohnung schön, ____ ist sie zu klein.", "text": "Einerseits ist die Wohnung schön, ____ ist sie zu klein.", "options": ["andererseits", "trotzdem", "außerdem", "deshalb"], "correctAnswer": "andererseits", "explanation": "einerseits...andererseits = on the one hand...on the other hand."},
            {"type": "write", "question": "Translate: The trains were delayed. Meanwhile, we waited at the station.", "correctAnswer": "Die Züge hatten Verspätung. Inzwischen warteten wir am Bahnhof.", "hint": "inzwischen = meanwhile, position 1 → inversion", "explanation": "inzwischen at position 1 → 'warteten wir'."},
            {"type": "multiple_choice", "question": "Which sentence uses 'denn' correctly?", "options": ["Ich bleibe, denn es regnet.", "Denn es regnet, bleibe ich.", "Ich bleibe, denn regnet es.", "Es regnet denn ich bleibe."], "correctAnswer": "Ich bleibe, denn es regnet.", "explanation": "denn is coordinating: verb stays in position 2 in the clause after denn: 'es regnet'."},
            {"type": "listen_and_answer", "question": "Listen and choose:", "audio_text": "Das Konzert war ausverkauft. Deshalb mussten wir umkehren.", "options": ["Das Konzert war ausverkauft. Deshalb mussten wir umkehren.", "Das Konzert war gut. Außerdem war es günstig.", "Obwohl das Konzert ausverkauft war, kamen wir rein.", "Weil das Konzert toll war, gingen wir hin."], "correctAnswer": "Das Konzert war ausverkauft. Deshalb mussten wir umkehren.", "explanation": "'Das Konzert war ausverkauft. Deshalb mussten wir umkehren.' — The concert was sold out. Therefore we had to turn back."},
            {"type": "table_fill", "question": "Mark each as Subordinating, Coordinating, or Adverbial:", "headers": ["Connector", "Type"], "rows": [["weil", "{Subordinating}"], ["denn", "{Coordinating}"], ["deshalb", "{Adverbial}"]], "correctAnswers": ["Subordinating", "Coordinating", "Adverbial"], "explanation": "Knowing the grammatical type tells you where the verb goes."}
        ]
    }
]

for lesson in b1_lessons:
    lesson["language"] = "german"
    path = os.path.join(BASE, "b1", f"{lesson['order']:02d}_{lesson['id'].split('_')[-1]}.json")
    write_lesson(path, lesson)

print("B1 lessons 04-05 done")
