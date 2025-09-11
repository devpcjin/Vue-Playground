<template>
  <div class="p-8 space-y-16">
    <!-- 기본 탭 예제 -->
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">기본 탭 (Headless UI 공식 예제)</h2>
        <p class="text-gray-600 text-lg">
          Headless UI의 기본 탭 구조입니다. 스타일링 없이 순수한 기능만 구현되어 있습니다.
        </p>
      </div>

      <div class="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-lg">
        <TabGroup>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="flex items-center justify-center">
      <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <div class="mx-4 px-2 py-2 bg-grey-50 rounded-full border border-gray-300 shadow-sm"></div>
      <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </div>

    <!-- 커스텀 탭 예제 -->
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">커스텀 탭 (스타일링 적용)</h2>
        <p class="text-gray-600 text-lg">
          기본 탭을 커스터마이징하여 각 탭마다 다른 색상과 스타일을 적용한 예제입니다.
        </p>
      </div>

      <div class="bg-blue-50 rounded-xl p-8 border border-blue-200 shadow-lg">
        <div class="flex justify-center">
          <div class="w-full max-w-2xl">
            <TabGroup v-slot="{ selectedIndex }">
              <TabList class="flex bg-gray-200 rounded-t-lg border-none p-0 m-0 gap-0">
                <Tab v-for="(tab, i) in tabs" :key="i" v-slot="{ selected }">
                  <button
                    :class="[
                      'flex-1 px-2.5 h-11 text-base font-medium rounded-none m-0 outline-none cursor-pointer flex items-center justify-center transition-all duration-200 relative z-10',
                      selected ? 'font-semibold z-20' : 'text-gray-400',
                      i === 0 && selected ? 'rounded-tl-lg' : '',
                      i === tabs.length - 1 && selected ? 'rounded-tr-lg' : '',
                    ]"
                    :style="
                      selected
                        ? {
                            borderLeft: '1.5px solid ' + borderColors[i],
                            borderTop: '1.5px solid ' + borderColors[i],
                            borderRight: '1.5px solid ' + borderColors[i],
                            borderBottom: 'none',
                            color: borderColors[i],
                            background: bgColors[i],
                          }
                        : {
                            border: 'none',
                            borderBottom: '1.5px solid ' + borderColors[selectedIndex],
                            color: '#bbb',
                            background: '#f3f4f6',
                          }
                    "
                  >
                    {{ tab }}
                  </button>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel
                  v-for="(panel, i) in panels"
                  :key="i"
                  v-show="selectedIndex === i"
                  class="rounded-b-lg px-0 py-9 text-xl min-h-[90px] text-center mt-0 w-full box-border z-10"
                  :style="{
                    borderLeft: '1.5px solid ' + borderColors[selectedIndex],
                    borderRight: '1.5px solid ' + borderColors[selectedIndex],
                    borderBottom: '1.5px solid ' + borderColors[selectedIndex],
                    borderTop: 'none',
                    background: bgColors[selectedIndex],
                    color: borderColors[selectedIndex],
                  }"
                >
                  <div class="text-xl font-medium text-center">{{ panel }}</div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

// 커스텀 탭 데이터
const tabs = ['주문탭1', '주문탭2', '주문탭3', '주문탭4'];
const panels = ['주문탭 내용1', '주문탭 내용2', '주문탭 내용3', '주문탭 내용4'];
const borderColors = ['#e74c3c', '#2196f3', '#27ae60', '#9b59b6'];
const bgColors = ['#fff5f5', '#f5faff', '#f5fff8', '#faf5ff'];
</script>
