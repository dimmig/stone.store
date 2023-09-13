import Reveal from "./Reveal";

const Timeline = () => {
  return (
    <div className="md:flex md:flex-row md:items-start md:gap-10 flex flex-col flex-between px-10">
      <Reveal delay={0}>
        <div className="card flex-col card-bb-1">
          <div className="year-block year-color__1 rounded-sm w-2/5 text-center">
            <h3 className="text-white text-5xl">2018</h3>
          </div>
          <p className="text-blue-50 p-5 pt-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, totam.
            Incidunt cumque, ducimus, culpa voluptatem alias ipsa natus, debitis
            illo voluptas consequatur praesentium. Natus, facere dolor fugiat
            vero mollitia, quaerat ipsum obcaecati explicabo nulla maiores
            eligendi doloribus voluptatibus quisquam illo quam nostrum sapiente
            a amet. Quia temporibus accusantium dolor modi.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="card flex-col card-bb-2">
          <div className="year-block year-color__2 rounded-sm w-2/5 text-center  ">
            <h3 className="text-white text-5xl">2020</h3>
          </div>
          <p className="text-blue-50 p-5 pt-0">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam
            accusamus deserunt eveniet quidem excepturi! Sint aliquam corrupti,
            temporibus quas error nulla, amet ad dicta aliquid explicabo officia
            totam harum facere enim vel. Assumenda, harum. Reprehenderit odio
            itaque recusandae sequi? Optio possimus et praesentium dicta
            deleniti autem qui, quaerat explicabo eaque?
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="card flex-col card-bb-3">
          <div className="year-block year-color__3 rounded-sm w-2/5 text-center">
            <h3 className="text-white text-5xl">2020</h3>
          </div>
          <p className="text-blue-50 p-5 pt-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            quis, doloremque, perferendis saepe eius asperiores ipsum eos
            exercitationem nemo sint eligendi labore voluptas aliquam tempora
            laborum, officia provident debitis reprehenderit quisquam ducimus
            sit deserunt. Nostrum iure quis debitis tempora? Nesciunt repellat
            quia non cumque accusamus error magni dolore sed natus.
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default Timeline;
