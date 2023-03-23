import * as categories from './products-categoires';
import * as urls from './products-urls';

const mapper = new Map<string, string>()

mapper.set(categories.AFTERWORKOUT, urls.AFTERWORKOUT);
mapper.set(categories.AMINOACIDS, urls.AMINOACIDES);
mapper.set(categories.CREATINE, urls.CREATINE);
mapper.set(categories.ENERGY_AND_AGITATION, urls.ENERGY_AND_AGITATION);
mapper.set(categories.FAT_BURNERS, urls.FAT_BURNERS);
mapper.set(categories.HEALTH_AND_VITAMINS, urls.HEALTH_AND_VITAMINS);
mapper.set(categories.JOINT_PROTECTION, urls.JOINT_PROTECTION);
mapper.set(categories.LIBIDO_IN_WOMAN, urls.LIBIDO_IN_WOMAN);
mapper.set(categories.LIVER_PROTECTION, urls.LIVER_PROTECTION);
mapper.set(categories.MEMORY_AND_CONCETRATION, urls.MEMORY_AND_CONCETRATION);
mapper.set(categories.POTENCY_AND_TESTOSTERONE, urls.POTENCY_AND_TESTOSTERONE);
mapper.set(categories.PREWORKOUT, urls.PREWORKOUT);
mapper.set(categories.SARMS, urls.SARMS);
mapper.set(categories.SLEEP_AND_RELAX, urls.SLEEP_AND_RELAX);
mapper.set(categories.STRESS_AND_NERVES, urls.STRESS_AND_NERVES);


export default mapper as ReadonlyMap<string, string>;
