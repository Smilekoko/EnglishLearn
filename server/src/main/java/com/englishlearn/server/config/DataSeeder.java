package com.englishlearn.server.config;

import com.englishlearn.server.grammar.GrammarExample;
import com.englishlearn.server.grammar.GrammarSection;
import com.englishlearn.server.grammar.GrammarSectionRepository;
import com.englishlearn.server.vocabulary.VocabSeries;
import com.englishlearn.server.vocabulary.VocabSeriesRepository;
import com.englishlearn.server.vocabulary.VocabWord;
import com.englishlearn.server.vowel.Vowel;
import com.englishlearn.server.vowel.VowelRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/**
 * 启动时把 seed/*.json 灌进 MySQL。
 * 元音表有数据就跳过；语法与词库按 id 增量插入，新增条目会补进去，已有条目不会被覆盖。
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final VowelRepository vowels;
    private final GrammarSectionRepository grammar;
    private final VocabSeriesRepository vocabulary;
    private final ObjectMapper mapper;

    public DataSeeder(
            VowelRepository vowels,
            GrammarSectionRepository grammar,
            VocabSeriesRepository vocabulary,
            ObjectMapper mapper) {
        this.vowels = vowels;
        this.grammar = grammar;
        this.vocabulary = vocabulary;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (vowels.count() == 0) {
            seedVowels();
        }
        // 语法与词库都按 id 增量插入：新增主题/系列不必清库，已有条目不会被覆盖
        seedGrammar();
        seedVocabulary();
    }

    private void seedVowels() throws Exception {
        List<VowelSeed> seeds = mapper.readValue(
                new ClassPathResource("seed/vowels.json").getInputStream(),
                new TypeReference<List<VowelSeed>>() {
                });
        List<Vowel> entities = seeds.stream()
                .map(s -> new Vowel(s.symbol(), s.label(), s.word(), s.wordIpa(), s.audioFile(), s.sortOrder()))
                .toList();
        vowels.saveAll(entities);
    }

    private void seedGrammar() throws Exception {
        List<GrammarSeed> seeds = mapper.readValue(
                new ClassPathResource("seed/grammar.json").getInputStream(),
                new TypeReference<List<GrammarSeed>>() {
                });

        for (GrammarSeed seed : seeds) {
            if (grammar.existsById(seed.id())) {
                continue;
            }
            GrammarSection section = new GrammarSection(
                    seed.id(),
                    seed.topic(),
                    seed.title(),
                    seed.en(),
                    seed.level(),
                    seed.summary(),
                    seed.sortOrder(),
                    seed.points());
            int order = 1;
            for (ExampleSeed example : seed.examples()) {
                section.addExample(new GrammarExample(example.en(), example.zh(), example.note(), order++));
            }
            grammar.save(section);
        }
    }

    private void seedVocabulary() throws Exception {
        List<VocabSeriesSeed> seeds = mapper.readValue(
                new ClassPathResource("seed/vocabulary.json").getInputStream(),
                new TypeReference<List<VocabSeriesSeed>>() {
                });

        for (VocabSeriesSeed seed : seeds) {
            if (vocabulary.existsById(seed.id())) {
                continue;
            }
            VocabSeries series =
                    new VocabSeries(seed.id(), seed.title(), seed.en(), seed.summary(), seed.sortOrder());
            int order = 1;
            for (VocabWordSeed word : seed.words()) {
                series.addWord(new VocabWord(
                        word.category(),
                        word.en(),
                        word.zh(),
                        word.note() == null ? "" : word.note(),
                        order++));
            }
            vocabulary.save(series);
        }
    }

    private record VowelSeed(
            String symbol, String label, String word, String wordIpa, String audioFile, int sortOrder) {
    }

    private record ExampleSeed(String en, String zh, String note) {
    }

    private record GrammarSeed(
            String id,
            String topic,
            String title,
            String en,
            String level,
            String summary,
            int sortOrder,
            List<String> points,
            List<ExampleSeed> examples) {
    }

    private record VocabWordSeed(String category, String en, String zh, String note) {
    }

    private record VocabSeriesSeed(
            String id, String title, String en, String summary, int sortOrder, List<VocabWordSeed> words) {
    }
}
