import { useEffect, useState } from 'react';
import {
  Input, Button, Select, Form
} from 'antd';
import { isNil, omitBy, debounce } from 'lodash';
import { ArrowUpOutlined, ArrowDownOutlined, FilterOutlined } from '@ant-design/icons';
import { IPerformerCategory } from '@interfaces/performer-category';
import { performerCategoryService } from '@services/perfomer-category.service';
import classNames from 'classnames';
import { COUNTRIES } from 'src/constants';
import { ImageWithFallback } from '@components/common';
import useBobyInfo from 'src/hooks/use-body-info';
import style from './performer-advanced-filter.module.scss';

interface IProps {
  onSubmit: Function;
}

function PerformerAdvancedFilter({
  onSubmit
}: IProps) {
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState<IPerformerCategory[]>([]);
  const bodyInfo = useBobyInfo();

  const {
    heights = [], weights = [], bodyTypes = [], genders = [], sexualOrientations = [], ethnicities = [],
    hairs = [], eyes = [], butts = [], ages = []
  } = bodyInfo;

  const handleSubmit = debounce((changedVal, allVal) => {
    const submitData = { ...allVal };
    // eslint-disable-next-line no-nested-ternary
    submitData.isFreeSubscription = submitData.isFreeSubscription === 'false' ? false : submitData.isFreeSubscription === 'true' ? true : '';
    onSubmit(omitBy(submitData, isNil));
  }, 600);

  const getData = async () => {
    const [categoriesResp] = await Promise.all([
      performerCategoryService.search()
    ]);
    setCategories(categoriesResp.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Form
      style={{ width: '100%' }}
      initialValues={{
        q: '',
        isFeatured: '',
        categoryIds: '',
        sortBy: 'live',
        isFreeSubscription: '',
        country: '',
        gender: '',
        sexualOrientation: '',
        age: '',
        eyes: '',
        hair: '',
        butt: ''
      }}
      onValuesChange={handleSubmit}
    >
      <div className={classNames(style['filter-block'], style.custom)}>
        <Form.Item className={classNames(style['filter-item'], style['item-50'])} name="q">
          <Input
            allowClear
            placeholder="Search creators, names, or vibe"
          />
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-25'])} name="sortBy">
          <Select style={{ width: '100%' }}>
            <Select.Option value="" disabled>
              <FilterOutlined />
              {' '}
              Sort By
            </Select.Option>
            <Select.Option value="popular">
              Popular
            </Select.Option>
            <Select.Option label="" value="latest">
              Latest
            </Select.Option>
            <Select.Option value="oldest">
              Oldest
            </Select.Option>
            <Select.Option value="online">
              Online
            </Select.Option>
            <Select.Option value="live">
              Live
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={classNames(style['filter-item'], style['item-25'])}>
          <Button
            className="primary"
            style={{ width: '100%' }}
            onClick={() => setShowMore(!showMore)}
          >
            More filters
            {' '}
            {showMore ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          </Button>
        </Form.Item>
      </div>
      <div className={classNames(style['filter-block'], style['filter-dropdown'], {
        [style.hide]: !showMore
      })}
      >
        <Form.Item className={style['filter-item']} name="isFeatured">
          <Select style={{ width: '100%' }}>
            <Select.Option value="">
              All creators
            </Select.Option>
            <Select.Option value="true">
              Featured
            </Select.Option>
            <Select.Option value="false">
              Non-featured
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="categoryIds">
          <Select style={{ width: '100%' }}>
            <Select.Option value="">
              All Categories
            </Select.Option>
            {categories.map((c) => (
              <Select.Option key={c._id} value={c._id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="isFreeSubscription">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              All subscriptions
            </Select.Option>
            <Select.Option key="false" value="false">
              Non-free subscription
            </Select.Option>
            <Select.Option key="true" value="true">
              Free subscription
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="country">
          <Select
            style={{ width: '100%' }}
            placeholder="Countries"
            showSearch
            optionFilterProp="label"
          >
            <Select.Option key="All" label="" value="">
              All countries
            </Select.Option>
            {COUNTRIES.map((c) => (
              <Select.Option key={c.code} label={c.name} value={c.code}>
                <ImageWithFallback
                  options={{
                    width: 40,
                    height: 40
                  }}
                  alt="flag"
                  src={c.flag}
                />
                &nbsp;
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="gender">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              All genders
            </Select.Option>
            {genders.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="sexualOrientation">
          <Select
            style={{ width: '100%' }}
          >
            <Select.Option key="all" value="">
              All sexual orientations
            </Select.Option>
            {sexualOrientations.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="age">
          <Select
            style={{ width: '100%' }}
            placeholder="Age"
          >
            <Select.Option key="all" value="">
              All ages
            </Select.Option>
            {ages.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="eyes">
          <Select
            style={{ width: '100%' }}
            placeholder="Eye color"
          >
            <Select.Option key="all" value="">
              All eye colors
            </Select.Option>
            {eyes.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="hair">
          <Select
            style={{ width: '100%' }}
            placeholder="Hair color"
          >
            <Select.Option key="all" value="">
              All hair colors
            </Select.Option>
            {hairs.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="butt">
          <Select
            style={{ width: '100%' }}
            placeholder="Butt size"
          >
            <Select.Option key="all" value="">
              All butt size
            </Select.Option>
            {butts.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="height">
          <Select
            style={{ width: '100%' }}
            placeholder="Height"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All heights
            </Select.Option>
            {heights.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="weight">
          <Select
            style={{ width: '100%' }}
            placeholder="Weight"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All weights
            </Select.Option>
            {weights.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="ethnicity">
          <Select
            style={{ width: '100%' }}
            placeholder="Ethnicity"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All ethnicities
            </Select.Option>
            {ethnicities.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className={style['filter-item']} name="bodyType">
          <Select
            style={{ width: '100%' }}
            placeholder="Body type"
            defaultValue=""
          >
            <Select.Option key="all" value="">
              All body types
            </Select.Option>
            {bodyTypes.map((s) => (
              <Select.Option key={s.value} value={s.value}>
                {s.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
}

export default PerformerAdvancedFilter;
