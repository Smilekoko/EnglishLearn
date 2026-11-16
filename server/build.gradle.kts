plugins {
    java
    id("org.springframework.boot") version "4.1.2"
}

group = "com.englishlearn"
version = "0.1.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    // 与 settings.gradle.kts 保持一致：优先阿里云镜像
    maven("https://maven.aliyun.com/repository/public")
    mavenCentral()
}

dependencies {
    // Spring Boot BOM：版本统一由它管理，下面的依赖不写版本号
    implementation(platform("org.springframework.boot:spring-boot-dependencies:4.1.2"))

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // MySQL 驱动（版本由 Spring Boot BOM 管理）
    runtimeOnly("com.mysql:mysql-connector-j")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
