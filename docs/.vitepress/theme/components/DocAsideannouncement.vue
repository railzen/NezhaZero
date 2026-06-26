<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useData } from 'vitepress';

export default defineComponent({
    name: 'BannerComponent',
    setup() {
        const { site } = useData();

        const banner = ref({
            link: 'https://github.com/railzen/nezha-zero/releases',
            icon: 'https://nezha.wiki/logo.png',
            projectVersionApi: 'https://api.github.com/repos/railzen/nezha-zero/releases/latest',
            dashboardVersion: '',
            agentVersion: '',
        });

        onMounted(async () => {
            await fetchLatestVersions();
        });

        const fetchLatestVersions = async () => {
            try {
                const response = await fetch(banner.value.projectVersionApi);
                const data = await response.json();
                banner.value.dashboardVersion = data.tag_name;
                banner.value.agentVersion = data.tag_name;
            } catch (error) {
                console.error('Error fetching project latest version:', error);
                banner.value.dashboardVersion = 'Error fetching';
                banner.value.agentVersion = 'Error fetching';
            }
        };

        const translations = {
            name: {
                'en-US': 'Announcement',
                'zh-CN': '公告栏',
            },
            version: {
                'en-US': 'Latest Version',
                'zh-CN': '最新版本',
            },
            change: {
                'en-US': 'View changelog',
                'zh-CN': '查看变更日志',
            },
        };

        return {
            banner,
            translations,
            site,
            fetchLatestVersions,
        };
    },
});
</script>

<template>
    <div>
        <a :href="banner.link" class="banner" target="_blank">
            <img v-if="banner.icon" :src="banner.icon" width="22" height="22" />
            <!-- <span class="name">{{ translations.name[site.lang] }}</span> -->
            <div class="info">
                <p v-if="banner.dashboardVersion !== ''" class="version">Dashboard {{ banner.dashboardVersion }}</p>
                <p v-if="banner.agentVersion !== ''" class="version">Agent {{ banner.agentVersion }}</p>
                <p class="change">{{ translations.change[site.lang] }}</p>
            </div>
        </a>
    </div>
</template>

<style lang="scss" scoped>
.VPDocAsideSponsors {
    margin-top: 8px !important;
}

.banner {
    margin: 0.25rem 0;
    padding: 0.4rem 0;
    border-radius: 0.8rem;
    position: relative;
    display: flex;
    align-items: center;
    // height: 5rem;    
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 1rem;
    background-color: var(--vp-c-bg-soft);
    border: 2px solid var(--vp-c-bg-soft);
    transition: border-color 0.5s;

    &:last-of-type {
        margin-bottom: 1rem;
    }

    &:hover {
        border: 2px solid var(--vp-c-brand-1);
    }

    img {
        transition: transform 0.5s;
        transform: scale(1.25);
    }

    &:hover img {
        transform: scale(1.75);
    }

    .name {
        background-image: linear-gradient(120deg, var(--vp-c-brand-3) 32%, var(--vp-c-brand-2), var(--vp-c-brand-1));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 0.9rem;
        font-weight: 600;
        margin-left: 1rem;
        writing-mode: vertical-rl;
        text-orientation: upright;
    }

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 0.5;
        height: 100%;
        position: relative;
    }

    .version {
        color: var(--vp-c-text-2);
        font-size: 0.8rem;
        font-weight: 700;
        white-space: nowrap;
        margin-top: auto;
        margin-bottom: auto;
    }

    .change {
        color: var(--vp-c-text-1);
        font-size: 0.8rem;
        font-weight: 700;
        margin-top: auto;
        text-align: center;
    }
}
</style>
