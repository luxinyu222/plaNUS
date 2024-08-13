import React from 'react';
import { SectionList, StyleSheet, Text, View, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import COLORS from '../constants/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontWeight: 'bold',
    fontSize: height / 40,
    color: COLORS.primary,
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  itemImage: {
    width: height / 8,
    height: height / 8,
    marginRight: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: width / 20,
    color: COLORS.secondary,
    fontWeight: 'bold',
    flex: 1, // Allow text to take remaining space
    flexWrap: 'wrap', // Wrap text to new lines
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1, // Allow container to use remaining space
  },
});


const Reading = () => {
  const sections = [
    {
      title: 'Time Management',
      data: [
        {
          title: 'What is time management?',
          link: 'https://www.techtarget.com/whatis/definition/time-management',
          image: 'https://cdn.ttgtmedia.com/rms/onlineImages/hr_software-mindfulness_tips.jpg',
        },
        {
          title: 'Time Management Tips: A Practical Guide',
          link: 'https://www.mindtools.com/pages/article/newHTE_00.htm',
          image: 'https://nova-live.imgix.net//tenantlogo-94c21083-c1b7-4c37-8425-fb2221f826d7.png?',
        },
        {
          title: 'How to Improve Your Time Management Skills',
          link: 'https://www.skillsyouneed.com/ps/time-management.html',
          image: 'https://www.skillsyouneed.com/images/priority-matrix.png',
        },
      ],
    },
    {
      title: 'Focus',
      data: [
        {
          title: 'How to focus better: 8 tips to improve concentration',
          link: 'https://www.calm.com/blog/how-to-focus',
          image: 'https://images.squarespace-cdn.com/content/v1/656f4e4dababbd7c042c4946/1b16e2b5-378f-435d-a1ad-cf4defc57f8d/how-to-focus-3_2.jpg?format=2500w',
        },
        {
          title: 'The Science of Attention: How to Focus Better',
          link: 'https://fs.blog/2013/12/how-to-focus/',
          image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f',
        },
        {
          title: 'Top 10 Ways to Train Your Brain to Stay Focused',
          link: 'https://facilethings.com/blog/en/top-10-ways-to-train-your-brain-to-stay-focused',
          image: 'https://s3.amazonaws.com/ft-docs/en/brain-training-to-staying-focused.png',
        },
      ],
    },
    {
      title: 'Procrastination',
      data: [
        {
          title: 'How to Stop Procrastinating',
          link: 'https://www.healthhub.sg/live-healthy/how-to-stop-procrastinating',
          image: 'https://ch-api.healthhub.sg/api/public/content/cb531ee4d73141dcb74d2e25fc810e13?v=460797c4&t=livehealthyheaderimage',
        },
        {
          title: 'Procrastination: Why You Do It and How to Overcome It',
          link: 'https://www.verywellmind.com/how-to-overcome-procrastination-2795714',
          image: 'https://www.verywellmind.com/thmb/6Lo0frejVXiyXAJfKfEb-zzHaTA=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/72003869-56a7948d3df78cf7729754c3.jpg',
        },
        {
          title: 'Procrastination: A Brief Guide on How to Stop Procrastinating',
          link: 'https://jamesclear.com/procrastination',
          image: 'https://jamesclear.com/wp-content/uploads/2015/06/procrastination-action-line-chart-960x640.jpg',
        },
      ],
    },
    {
      title: 'Productivity',
      data: [
        {
          title: '10 ways to boost your productivity at work',
          link: 'https://www.atlassian.com/blog/productivity/simple-ways-to-be-productive-at-work',
          image: 'https://atlassianblog.wpengine.com/wp-content/uploads/2023/03/1231_atlassian_10-ways-to-boost-your-productivity-at-work_1120x545@2x-1560x760.jpg',
        },
        {
          title: 'Productivity Hacks for a More Efficient Life',
          link: 'https://www.forbes.com/sites/forbescoachescouncil/2019/03/27/productivity-hacks-for-a-more-efficient-life/',
          image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18',
        },
        {
          title: 'What is productivity? Definition and ways to improve',
          link: 'https://www.betterup.com/blog/what-is-productivity',
          image: 'https://www.betterup.com/hubfs/Imported_Blog_Media/what%20is%20productivity%20-%20blog%20image-1.jpg',
        },
      ],
    },
    {
      title: 'Stress Management',
      data: [
        {
          title: 'Ways to Manage Stress',
          link: 'https://www.webmd.com/balance/stress-management/stress-management',
          image: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/stop_stress_slideshow/thinkstock_rf_photo_of_woman_enjoying_fresh_air.jpg?resize=600:*',
        },
        {
          title: '10 Stress Management Techniques for a Healthier Life',
          link: 'https://www.verywellmind.com/stress-management-4157211',
          image: 'https://www.verywellmind.com/thmb/Y4Ik6HXVNNdYCGKo8up6xx2qsr0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/that-s-it--i-m-done--936117884-30b9067edcac4976a48d006a4f0f88b7.jpg',
        },
        {
          title: 'How to Relieve Stress: 16 Science-Backed Tips',
          link: 'https://www.healthline.com/nutrition/16-ways-relieve-stress-anxiety',
          image: 'https://i0.wp.com/healthline-activation-prod.healthline.com/driver-images/b04ac063-e44c-4583-b7c2-8a7d3f646754%20(2).jpg?',
        },
      ],
    },
    {
      title: 'Goal Setting',
      data: [
        {
          title: 'The ultimate goal setting process: 7 steps to creating better goals',
          link: 'https://www.lucidchart.com/blog/7-steps-to-creating-better-goals',
          image: 'https://corporate-assets.lucid.co/chart/c10fdc7c-5fc9-4273-bff3-ee5283eb12c4.png',
        },
        {
          title: 'Goal-Setting',
          link: 'https://inside.ewu.edu/calelearning/psychological-skills/goal-setting/',
          image: 'https://in.ewu.edu/calelearning/wp-content/uploads/sites/84/2016/05/graduation.jpg',
        },
        {
          title: 'Goal-setting theory: Why it’s important, and how to use it at work',
          link: 'https://www.betterup.com/blog/goal-setting-theory',
          image: 'https://9253440.fs1.hubspotusercontent-na1.net/hubfs/9253440/goal-setting-theory-person-writes-on-board-presenting-to-team.webp',
        },
      ],
    },
  ];

  const handlePress = (link) => {
    Linking.openURL(link).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemTextContainer}>
              <TouchableOpacity onPress={() => handlePress(item.link)}>
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Reading;
