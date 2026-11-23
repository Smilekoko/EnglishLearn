package com.englishlearn.server.config;

import com.englishlearn.server.consonant.Consonant;
import com.englishlearn.server.consonant.ConsonantExample;
import com.englishlearn.server.consonant.ConsonantRepository;
import com.englishlearn.server.grammar.GrammarCategoryEntity;
import com.englishlearn.server.grammar.GrammarCategoryRepository;
import com.englishlearn.server.grammar.GrammarExample;
import com.englishlearn.server.grammar.GrammarSection;
import com.englishlearn.server.grammar.GrammarSectionRepository;
import com.englishlearn.server.grammar.GrammarTopicEntity;
import com.englishlearn.server.grammar.GrammarTopicRepository;
import com.englishlearn.server.vocabulary.VocabSeries;
import com.englishlearn.server.vocabulary.VocabSeriesRepository;
import com.englishlearn.server.vocabulary.VocabWord;
import com.englishlearn.server.vowel.Vowel;
import com.englishlearn.server.vowel.VowelExample;
import com.englishlearn.server.vowel.VowelRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/**
 * 启动时把 seed/*.json 灌进 MySQL，前端不再保存任何内容数据。
 *
 * <p>元音、辅音按符号、语法目录按 id upsert（可以先在库里改，重启会被文件覆盖回种子值）；
 * 语法条目和词库按 id 增量插入，已有条目不会被覆盖。
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final VowelRepository vowels;
    private final ConsonantRepository consonants;
    private final GrammarSectionRepository grammar;
    private final GrammarCategoryRepository grammarCategories;
    private final GrammarTopicRepository grammarTopics;
    private final VocabSeriesRepository vocabulary;
    private final ObjectMapper mapper;

    public DataSeeder(
            VowelRepository vowels,
            ConsonantRepository consonants,
            GrammarSectionRepository grammar,
            GrammarCategoryRepository grammarCategories,
            GrammarTopicRepository grammarTopics,
            VocabSeriesRepository vocabulary,
            ObjectMapper mapper) {
        this.vowels = vowels;
        this.consonants = consonants;
        this.grammar = grammar;
        this.grammarCategories = grammarCategories;
        this.grammarTopics = grammarTopics;
        this.vocabulary = vocabulary;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedVowels();
        seedConsonants();
        seedGrammarCatalog();
        seedGrammar();
        seedVocabulary();
    }

    private void seedVowels() throws Exception {
        List<VowelSeed> seeds =
                read("seed/vowels.json", new TypeReference<List<VowelSeed>>() {
                });

        for (VowelSeed seed : seeds) {
            Vowel vowel = vowels.findBySymbol(seed.symbol()).orElseGet(() -> new Vowel(seed.symbol()));
            vowel.update(
                    seed.kind(),
                    seed.label(),
                    seed.word(),
                    seed.wordIpa(),
                    seed.tip(),
                    seed.audioFile(),
                    seed.sortOrder());
            vowel.replaceExamples(seed.examples().stream()
                    .map(example -> new VowelExample(example.word(), example.ipa()))
                    .toList());
            vowels.save(vowel);
        }
    }

    private void seedConsonants() throws Exception {
        List<ConsonantSeed> seeds =
                read("seed/consonants.json", new TypeReference<List<ConsonantSeed>>() {
                });

        for (ConsonantSeed seed : seeds) {
            Consonant consonant = consonants
                    .findBySymbol(seed.symbol())
                    .orElseGet(() -> new Consonant(seed.symbol()));
            consonant.update(
                    seed.kind(),
                    seed.label(),
                    seed.word(),
                    seed.wordIpa(),
                    seed.audioFile(),
                    seed.tip(),
                    seed.sortOrder());
            consonant.replaceExamples(seed.examples().stream()
                    .map(example -> new ConsonantExample(example.word(), example.ipa()))
                    .toList());
            consonants.save(consonant);
        }
    }

    private void seedGrammarCatalog() throws Exception {
        List<CategorySeed> categories =
                read("seed/grammar-categories.json", new TypeReference<List<CategorySeed>>() {
                });
        for (CategorySeed seed : categories) {
            grammarCategories.save(new GrammarCategoryEntity(
                    seed.id(), seed.title(), seed.en(), seed.description(), seed.sortOrder()));
        }

        List<TopicSeed> topics =
                read("seed/grammar-topics.json", new TypeReference<List<TopicSeed>>() {
                });
        for (TopicSeed seed : topics) {
            grammarTopics.save(new GrammarTopicEntity(
                    seed.id(),
                    seed.category(),
                    seed.title(),
                    seed.en(),
                    seed.cardText(),
                    seed.lead(),
                    seed.sortOrder()));
        }
    }

    private void seedGrammar() throws Exception {
        List<GrammarSeed> seeds =
                read("seed/grammar.json", new TypeReference<List<GrammarSeed>>() {
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
        List<VocabSeriesSeed> seeds =
                read("seed/vocabulary.json", new TypeReference<List<VocabSeriesSeed>>() {
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

    private <T> T read(String resource, TypeReference<T> type) throws Exception {
        return mapper.readValue(new ClassPathResource(resource).getInputStream(), type);
    }

    private record VowelWordSeed(String word, String ipa) {
    }

    private record VowelSeed(
            String symbol,
            String kind,
            String label,
            String word,
            String wordIpa,
            String audioFile,
            String tip,
            int sortOrder,
            List<VowelWordSeed> examples) {
    }

    private record ConsonantWordSeed(String word, String ipa) {
    }

    private record ConsonantSeed(
            String symbol,
            String kind,
            String label,
            String word,
            String wordIpa,
            String audioFile,
            String tip,
            int sortOrder,
            List<ConsonantWordSeed> examples) {
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

    private record CategorySeed(String id, String title, String en, String description, int sortOrder) {
    }

    private record TopicSeed(
            String id,
            String category,
            String title,
            String en,
            String cardText,
            String lead,
            int sortOrder) {
    }

    private record VocabWordSeed(String category, String en, String zh, String note) {
    }

    private record VocabSeriesSeed(
            String id, String title, String en, String summary, int sortOrder, List<VocabWordSeed> words) {
    }
}
