<template>
  <div class="min-h-screen flex items-start justify-center pt-10 -m-8 -mt-[120px]">
    <div class="w-90 mx-auto bg-transparent">
      <TabGroup v-slot="{ selectedIndex }">
        <TabList class="flex bg-gray-200 rounded-t-lg border-none p-0 m-0 gap-0">
          <Tab v-for="(tab, i) in tabs" :key="i" v-slot="{ selected }">
            <button
              :class="[
                'flex-1 px-2.5 h-11 text-base font-medium border-none rounded-none m-0 outline-none cursor-pointer flex items-center justify-center transition-all duration-200 relative z-10',
                selected ? 'bg-white font-semibold z-20' : 'bg-gray-200 text-gray-400',
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
            class="rounded-b-lg bg-white px-0 py-9 text-xl min-h-[90px] text-center mt-0 w-full box-border z-10"
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
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

const tabs = ['주문탭1', '주문탭2', '주문탭3', '주문탭4'];
const panels = ['주문탭 내용1', '주문탭 내용2', '주문탭 내용3', '주문탭 내용4'];
const borderColors = ['#e74c3c', '#2196f3', '#27ae60', '#9b59b6'];
const bgColors = ['#fff5f5', '#f5faff', '#f5fff8', '#faf5ff'];
</script>
