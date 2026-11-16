package com.englishlearn.server.grammar;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/grammar")
public class GrammarController {

    private final GrammarSectionRepository sections;
    private final GrammarCategoryRepository categories;
    private final GrammarTopicRepository topics;

    public GrammarController(
            GrammarSectionRepository sections,
            GrammarCategoryRepository categories,
            GrammarTopicRepository topics) {
        this.sections = sections;
        this.categories = categories;
        this.topics = topics;
    }

    /** 不传 topic 返回全部；传了按主题过滤，如 /api/grammar?topic=articles */
    @GetMapping
    public List<GrammarDto> list(@RequestParam(required = false) String topic) {
        List<GrammarSection> list = (topic == null || topic.isBlank())
                ? sections.findAllByOrderBySortOrderAsc()
                : sections.findAllByTopicOrderBySortOrderAsc(topic);

        return list.stream().map(GrammarDto::from).toList();
    }

    /** 语法目录：大类、主题、每个主题的节数，全部来自数据库 */
    @GetMapping("/topics")
    public List<GrammarCatalogDto> catalog() {
        Map<String, Integer> counts = new HashMap<>();
        for (GrammarTopicEntity topic : topics.findAllByOrderBySortOrderAsc()) {
            counts.put(topic.getId(), (int) sections.countByTopic(topic.getId()));
        }

        List<GrammarTopicEntity> all = topics.findAllByOrderBySortOrderAsc();
        return categories.findAllByOrderBySortOrderAsc().stream()
                .map(category -> new GrammarCatalogDto(
                        category.getId(),
                        category.getTitle(),
                        category.getEn(),
                        category.getDescription(),
                        all.stream()
                                .filter(topic -> category.getId().equals(topic.getCategory()))
                                .map(topic -> new GrammarCatalogDto.TopicDto(
                                        topic.getId(),
                                        topic.getTitle(),
                                        topic.getEn(),
                                        topic.getCardText(),
                                        topic.getLead(),
                                        counts.getOrDefault(topic.getId(), 0)))
                                .toList()))
                .toList();
    }

    @GetMapping("/{id}")
    public GrammarDto one(@PathVariable String id) {
        return sections.findById(id)
                .map(GrammarDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "语法主题不存在: " + id));
    }
}
